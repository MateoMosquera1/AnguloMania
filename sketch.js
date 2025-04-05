const contenedor = document.querySelector('.contenedor');
const footer = document.querySelector('.footer');

const chatBot = {
  texto: '',
  entrada: '',
  respuesta: ''
};

function mostrarConversacion() {
  const elementosHtml = [
    `<p>${chatBot.texto}</p>`,
    `<input type="text" id="entrada" placeholder="Escribe tu mensaje">`,
    `<button id="enviar">Enviar</button>`
  ].join('');

  contenedor.innerHTML += elementosHtml;
}

function enviarMensaje() {
  const entrada = document.querySelector('#entrada').value;
  chatBot.texto = `Tu mensaje es: ${entrada}`;
  chatBot.entrada = '';
}

const enviarBoton = document.querySelector('#enviar');
enviarBoton.addEventListener('click', enviarMensaje);

mostrarConversacion();

const entradaTeclado = document.querySelector('#entrada');

function teclado() {
  const texto = document.querySelector('input[type="text"]').value;
  if (texto !== '') {
    chatBot.texto += ` Tu mensaje es: ${texto}\n`;
  }
}

const audioContext = new AudioContext();
const microphone = new MediaStreamAudioSourceNode(audioContext);

function reconocerVoz() {
  const audioBuffer =  navigator.mediaDevices.getUserMedia({ audio: true });
  microphone.connect(audioBuffer);
  console.log('Voz reconocida');
}