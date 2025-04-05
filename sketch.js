<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ÁnguloManía</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; background-color: #000; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
  <script>
    let anguloCorrecto, anguloUsuario, nivel = 1, puntos = 0;
    let tiempo = 30, tiempoInicio, jugando = false, nombre = "", estado = "menu";
    let jugadores = [];
    let inputNombre, botonInicio, botonReiniciar;
    let figuras = [];
    let tipoAngulo = "";

    function setup() {
      createCanvas(windowWidth, windowHeight);
      angleMode(DEGREES);
      cargarJugadores();

      inputNombre = createInput();
      inputNombre.position(width / 2 - 100, height / 2 - 60);
      inputNombre.size(200);
      inputNombre.attribute("placeholder", "Ingresa tu nombre o apodo");

      botonInicio = createButton("¡JUGAR!");
      botonInicio.position(width / 2 - 50, height / 2);
      botonInicio.mousePressed(iniciarJuego);

      botonReiniciar = createButton("Jugar de nuevo");
      botonReiniciar.position(width / 2 - 60, height - 60);
      botonReiniciar.mousePressed(reiniciarJuego);
      botonReiniciar.hide();
    }

    function draw() {
      cambiarFondo();
      if (estado === "menu") {
        mostrarMenu();
      } else if (estado === "jugando") {
        mostrarJuego();
      } else if (estado === "final") {
        mostrarFinal();
      }
    }

    function iniciarJuego() {
      nombre = inputNombre.value().trim();
      if (nombre === "") return;

      inputNombre.hide();
      botonInicio.hide();
      tiempoInicio = millis();
      jugando = true;
      estado = "jugando";
      nuevoNivel();
    }

    function mostrarMenu() {
      textAlign(CENTER);
      fill(255);
      textSize(36);
      text("🎯 ÁnguloManía 🎮", width / 2, height / 4);
      textSize(20);
      text("Usa ← y → para mover el ángulo. Presiona ESPACIO para confirmar.", width / 2, height / 4 + 40);
      textSize(16);
      fill(180);
      text("By: Mateo Cuesta, Héctor Andrés", width / 2, height - 60);
      text("Fundación Universitaria María Cano", width / 2, height - 40);
    }

    function mostrarJuego() {
      let tiempoRestante = tiempo - floor((millis() - tiempoInicio) / 1000);
      textSize(24);
      fill(255);
      textAlign(LEFT);
      text("⏱️ Tiempo: " + tiempoRestante, 30, 40);
      text("Nivel: " + nivel, 30, 70);
      text("Puntos: " + puntos, 30, 100);

      textAlign(CENTER);
      textSize(24);
      fill(255, 255, 0);
      text("Haz un ángulo tipo: " + tipoAngulo, width / 2, 140);

      push();
      translate(width / 2, height / 2);
      stroke(255);
      strokeWeight(5);
      line(0, 0, 150, 0);
      rotate(anguloUsuario);
      stroke(255, 0, 0);
      line(0, 0, 150, 0);
      pop();

      fill(255);
      textSize(20);
      text("Gira el ángulo con ← y →", width / 2, height - 120);
      text("Presiona ESPACIO si crees que está bien", width / 2, height - 90);

      if (tiempoRestante <= 0) {
        finalizarJuego();
      }
    }

    function keyPressed() {
      if (estado === "jugando") {
        if (keyCode === LEFT_ARROW) anguloUsuario -= 7;
        if (keyCode === RIGHT_ARROW) anguloUsuario += 7;
        if (key === " ") verificarAngulo();
      }
    }

    function nuevoNivel() {
      anguloCorrecto = int(random(20, 160));
      anguloUsuario = 0;

      if (anguloCorrecto < 90) tipoAngulo = "Agudo (< 90°)";
      else if (anguloCorrecto === 90) tipoAngulo = "Recto (= 90°)";
      else tipoAngulo = "Obtuso (> 90°)";
      else tipoAngulo = "Desconocido";
    }

    function verificarAngulo() {
      if (abs(anguloUsuario - anguloCorrecto) <= 5) {
        puntos += 10;
        nivel++;
        nuevoNivel();
      } else {
        puntos -= 5;
      }
    }

    function finalizarJuego() {
      jugando = false;
      estado = "final";
      guardarPuntaje();
      botonReiniciar.show();
    }

    function reiniciarJuego() {
      puntos = 0;
      nivel = 1;
      tiempoInicio = millis();
      botonReiniciar.hide();
      estado = "jugando";
      nuevoNivel();
    }

    function guardarPuntaje() {
      jugadores.push({ nombre: nombre, puntos: puntos });
      jugadores.sort((a, b) => b.puntos - a.puntos);
      jugadores = jugadores.slice(0, 10);
      localStorage.setItem("jugadoresAnguloMania", JSON.stringify(jugadores));
    }

    function cargarJugadores() {
      let data = localStorage.getItem("jugadoresAnguloMania");
      if (data) jugadores = JSON.parse(data);
    }

    function mostrarFinal() {
      background(0);
      fill(0, 255, 200);
      textAlign(CENTER);
      textSize(32);
      text("¡Juego terminado!", width / 2, 80);
      textSize(20);
      text("Tu puntaje: " + puntos, width / 2, 120);
      text("Top 10 jugadores:", width / 2, 160);

      for (let i = 0; i < jugadores.length; i++) {
        let jugador = jugadores[i];
        text(`${i + 1}. ${jugador.nombre} - ${jugador.puntos} puntos`, width / 2, 200 + i * 25);
      }
    }

    function cambiarFondo() {
      let c1 = color(10, 10, 30);
      let c2 = nivel < 4 ? color(0, 255, 150) : nivel < 7 ? color(255, 0, 150) : color(255, 150, 0);

      for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        stroke(lerpColor(c1, c2, inter));
        line(0, y, width, y);
      }

      if (figuras.length < 50) {
        figuras.push({
          x: random(width),
          y: random(height),
          size: random(10, 30),
          shape: random(["circle", "square", "triangle"]),
          speed: random(0.5, 1.5),
          angle: random(TWO_PI)
        });
      }

      noStroke();
      for (let f of figuras) {
        fill(255, 50);
        push();
        translate(f.x, f.y);
        rotate(f.angle);
        if (f.shape === "circle") ellipse(0, 0, f.size);
        else if (f.shape === "square") rectMode(CENTER), rect(0, 0, f.size, f.size);
        else triangle(-f.size / 2, f.size / 2, 0, -f.size / 2, f.size / 2, f.size / 2);
        pop();
        f.y += f.speed;
        if (f.y > height) f.y = 0;
        f.angle += 0.003;
      }
    }
  </script>
</body>
</html>

 
