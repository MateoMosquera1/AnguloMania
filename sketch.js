let anguloUsuario = 0;
let anguloObjetivo = 0;
let estado = "formar"; // puede ser 'formar' o 'clasificar'
let respuestaCorrecta = "";
let mensaje = "";
let puntos = 0;
let nivel = 1;
let margenError = 7;
let opciones = ["Agudo", "Recto", "Obtuso", "Nulo"];
let botones = [];

let nombreJugador = "";
let juegoIniciado = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  nuevoReto();
  crearBotones();
}

function draw() {
  background(10, 15, 40); // fondo estilo arcade

  if (!juegoIniciado) {
    pantallaInicio();
  } else {
    mostrarJuego();
  }

  // Mensaje temporal
  if (mensaje && frameCount % 180 === 0) {
    mensaje = "";
  }
}

function pantallaInicio() {
  fill(255);
  textSize(32);
  text("Bienvenido a ÁnguloManía PRO 🧠", width / 2, height / 3);
  textSize(20);
  text("Escribe tu nombre y presiona Enter", width / 2, height / 2);
  textSize(24);
  text(nombreJugador + "|", width / 2, height / 2 + 40);

  textSize(16);
  text("By: Mateo Cuesta, Héctor Andrés", width / 2, height - 60);
  text("Fundación Universitaria María Cano", width / 2, height - 30);
}

function keyPressed() {
  if (!juegoIniciado) {
    if (keyCode === ENTER && nombreJugador.trim().length > 0) {
      juegoIniciado = true;
    } else if (key.length === 1 && key !== " ") {
      nombreJugador += key;
    } else if (keyCode === BACKSPACE) {
      nombreJugador = nombreJugador.slice(0, -1);
    }
  } else {
    if (estado === "formar") {
      if (keyCode === LEFT_ARROW) {
        anguloUsuario = max(0, anguloUsuario - 3);
      } else if (keyCode === RIGHT_ARROW) {
        anguloUsuario = min(180, anguloUsuario + 3);
      } else if (key === " ") {
        verificarAngulo();
      }
    }
  }
}

function mostrarJuego() {
  fill(255);
  textSize(20);
  text(`Jugador: ${nombreJugador}`, width / 2, 30);
  text(`Nivel: ${nivel} | Puntos: ${puntos}`, width / 2, 60);

  if (estado === "formar") {
    text(`Forma un ángulo de ${anguloObjetivo}°`, width / 2, 100);
  } else if (estado === "clasificar") {
    text(`¿Qué tipo de ángulo es ${anguloObjetivo}°?`, width / 2, 100);
  }

  // Dibujo del ángulo
  push();
  translate(width / 2, height / 2 + 60);
  stroke(0, 255, 0);
  strokeWeight(4);
  line(0, 0, 200, 0); // línea base

  rotate(-anguloUsuario);
  stroke(255, 0, 0);
  line(0, 0, 200, 0); // línea que gira
  pop();

  textSize(22);
  fill(255);
  text("Ángulo actual: " + Math.round(anguloUsuario) + "°", width / 2, height - 60);

  // Mostrar mensaje
  if (mensaje) {
    textSize(26);
    fill(255, 255, 0);
    text(mensaje, width / 2, height / 2 - 150);
  }

  // Mostrar botones si está clasificando
  if (estado === "clasificar") {
    for (let i = 0; i < botones.length; i++) {
      botones[i].show();
    }
  } else {
    for (let i = 0; i < botones.length; i++) {
      botones[i].hide();
    }
  }
}

function verificarAngulo() {
  if (abs(anguloUsuario - anguloObjetivo) <= margenError) {
    mensaje = "¡Bien hecho! Ahora clasifica el ángulo 📐";
    estado = "clasificar";
  } else {
    mensaje = "Sigue ajustando...";
  }
}

function crearBotones() {
  for (let i = 0; i < opciones.length; i++) {
    let b = createButton(opciones[i]);
    b.position(width / 2 - 150 + i * 100, height - 100);
    b.mousePressed(() => clasificarAngulo(opciones[i]));
    b.hide();
    botones.push(b);
  }
}

function clasificarAngulo(respuesta) {
  if (respuesta === respuestaCorrecta) {
    mensaje = "✅ ¡Correcto!";
    puntos += 10;
    nivel++;
  } else {
    mensaje = "❌ Incorrecto";
    puntos = max(0, puntos - 5);
  }

  setTimeout(() => {
    nuevoReto();
    mensaje = "";
  }, 1500);
}

function nuevoReto() {
  estado = "formar";
  anguloObjetivo = int(random(0, 180));
  anguloUsuario = 0;

  if (anguloObjetivo === 0) {
    respuestaCorrecta = "Nulo";
  } else if (anguloObjetivo < 90) {
    respuestaCorrecta = "Agudo";
  } else if (anguloObjetivo === 90) {
    respuestaCorrecta = "Recto";
  } else {
    respuestaCorrecta = "Obtuso";
  }

  margenError = max(3, 10 - nivel);
}
