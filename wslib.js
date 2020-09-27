const WebSocket = require("ws");
const Message = require("./models/client");
const Joi = require("joi");

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
      /*
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
      */

      let obj = JSON.parse(message);
      const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string()
          .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
          .required(),
        ts: Joi.required(),
      });
      const { error } = schema.validate(obj);
      if (error) {
        console.log(error);
        res.statusCode = 400;
        res.send(
          "No se cumplió alguna condición de autor o mensaje " + error.message
        );
      } else {
        Message.create({
          message: obj.message,
          ts: obj.ts,
          author: obj.author,
        });

        console.log("enviado " + obj.message);
        messages.push(obj.message);

        sendMessages();
      }
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    client.send(JSON.stringify(messages));
  });
};

exports.sendMessages = sendMessages;
exports.wsConnection = wsConnection;
