let anguloUsuario = 0;
let anguloCorrecto = 0;
let tipoAngulo = "";
let puntos = 0;
let nivel = 1;
let margenError = 10;
let mensaje = "";
let esperando = false;

let nombreJugador = "";
let juegoIniciado = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  nuevoNivel();
}

function draw() {
  background(20);
  
  if (!juegoIniciado) {
    mostrarPantallaInicio();
  } else {
    mostrarJuego();
  }
}

function mostrarPantallaInicio() {
  fill(255);
  textSize(32);
  text("Bienvenido a ÁnguloManía 🎯", width / 2, height / 3);
  textSize(20);
  text("Escribe tu nombre o apodo y presiona Enter para comenzar", width / 2, height / 2);

  textSize(18);
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
    if (keyCode === LEFT_ARROW) {
      anguloUsuario = max(anguloUsuario - 2, 0);
    } else if (keyCode === RIGHT_ARROW) {
      anguloUsuario = min(anguloUsuario + 2, 180);
    } else if (key === " ") {
      verificarAngulo();
    }
  }
}

function mostrarJuego() {
  fill(255);
  textSize(20);
  text(`Jugador: ${nombreJugador}`, width / 2, 30);
  text(`Nivel: ${nivel} | Puntos: ${puntos}`, width / 2, 60);
  text(`Gira para formar un ángulo de tipo: ${tipoAngulo}`, width / 2, 100);

  // Dibujo del ángulo
  push();
  translate(width / 2, height / 2 + 50);
  stroke(0, 255, 0);
  strokeWeight(4);
  line(0, 0, 200, 0); // Línea fija
  rotate(-anguloUsuario); 
  stroke(255, 0, 0);
  line(0, 0, 200, 0); // Línea que rota
  pop();

  // Mostrar ángulo actual
  fill(255);
  textSize(24);
  text("Ángulo actual: " + Math.round(anguloUsuario) + "°", width / 2, height - 60);

  if (mensaje !== "") {
    textSize(28);
    fill(255, 255, 0);
    text(mensaje, width / 2, height / 2 - 100);
  }
}

function verificarAngulo() {
  if (esperando) return;

  if (abs(anguloUsuario - anguloCorrecto) <= margenError) {
    mensaje = "¡Correcto! 🎉";
    puntos += 10;
    nivel++;
    margenError = max(2, 10 - nivel); // cada nivel es más estricto
  } else {
    mensaje = "Incorrecto 😢";
    puntos = max(0, puntos - 5);
  }

  esperando = true;

  setTimeout(() => {
    mensaje = "";
    esperando = false;
    nuevoNivel();
  }, 1500);
}

function nuevoNivel() {
  anguloCorrecto = int(random(20, 160));
  anguloUsuario = 0;

  if (anguloCorrecto < 90) {
    tipoAngulo = "Agudo (< 90°)";
  } else if (anguloCorrecto === 90) {
    tipoAngulo = "Recto (= 90°)";
  } else {
    tipoAngulo = "Obtuso (> 90°)";
  }
}

 
