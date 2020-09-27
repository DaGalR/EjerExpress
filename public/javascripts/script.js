const ws = new WebSocket("ws://localhost:3000");
let nombreAutor = "";

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  let fecha = new Date();
  let fse = fecha.getTime();
  let obj = {
    message: message.value,
    ts: fse,
    author: nombreAutor,
  };
  ws.send(JSON.stringify(obj));
  message.value = "";
};

const handleAuthorSubmit = (evt) => {
  evt.preventDefault();
  let authorText = document.getElementById("author");

  if (!authorText.value) {
    alert("Ingresa tu nombre por favor");
  } else {
    nombreAutor = authorText.value;
    if (nombre.style.display == "block") {
      nombre.style.display = "none";
    }

    if (chat.style.display == "block") {
      chat.style.display = "none";
    } else {
      chat.style.display = "block";
    }
  }
};

const nombre = document.getElementById("nombre");
const bttnAuthor = document.getElementById("bttnAuthor");
const chat = document.getElementById("chat");
const form = document.getElementById("form");

form.addEventListener("submit", handleSubmit);
bttnAuthor.addEventListener("click", handleAuthorSubmit);
