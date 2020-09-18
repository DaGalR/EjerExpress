const WebSocket = require("ws");
const fs = require("fs");

const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      /*
      const data = message.split(",");
      const obj = {};
      obj.message = data[0];
      obj.author = data[1];
      obj.ts = data[2];
      let texto = data[0];
      */
      let obj = JSON.parse(message);
      let texto = obj.message;
      fs.access("db.json", fs.constants.F_OK, (err) => {
       
          fs.readFile("db.json", (err, data) => {
            if (err) {
              console.log("Error de lectura de db.json");
            } else {
              let contenido = data.toString();
              if(contenido != "[]" ){
                contenido = contenido.replace("]", `,${message} ]`);
              }
              else{
                contenido = contenido.replace("]", `${message} ]`);
              }
              fs.writeFile("db.json", contenido, (err) => {
                if (err) console.log("Error escritura");
              });
            }
          });
        
      });
      messages.push(texto);

      sendMessages();
    });
  });
};

const sendMessages = () => {

  clients.forEach((client) => {
    client.send(JSON.stringify(messages))
    
  });
};


exports.sendMessages = sendMessages;
exports.wsConnection = wsConnection;
