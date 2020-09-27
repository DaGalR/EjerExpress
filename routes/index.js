var express = require("express");
var router = express.Router();
const ws = require("../wslib");
const Joi = require("joi");
const Message = require("../models/client");
const { response } = require("express");
/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat/api/messages', function(req, res, next){

  fs.readFile("db.json", (err, data) => {
    let messages = data.toString();
    res.send(messages);
  });
});

router.get('/chat/api/messages/:ts', function(req, res, next){
  fs.readFile("db.json", (err, data) => {
    let messages = data.toString();
    let json = JSON.parse(messages);  
    let obj = {"message": "", "author": "", "ts": 0};
    for(let count = 0; count<json.length; count++){
      let comp = JSON.parse(JSON.stringify(json[count]));
      if(comp.ts == req.params.ts){

        obj.message = comp.message;
        obj.author = comp.author;
        obj.ts = comp.ts;
        break;
      }
    }
    if(obj.message != ""){
      res.statusCode = 200;
      res.send(JSON.stringify(obj));
    }
    else{
      res.statusCode = 400;
      res.send("No hay mensaje con timestamp requerido");
    }
  });
});

router.post('/chat/api/messages', function(req, res, next){
  
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.statusCode = 400;
    res.send("No se cumplió alguna condición de autor o mensaje "+ error.message);
  } else {
    fs.readFile("db.json", (err, data) => {
      if (err) console.log("error de lectura de DB");
      else {
        let content = data.toString();
        if (content != "[]") {
          content = content.replace("]", `,${JSON.stringify(req.body)}]`);
          fs.writeFileSync("db.json", content);
          res.send("Mensaje creado");
        } else {
          content = content.replace("]", `${JSON.stringify(req.body)}]`);
          fs.writeFileSync("db.json", content);
          res.send("Mensaje creado");
        }
      }
    });
  }
});

router.put('/chat/api/messages', function(req, res, next){

  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.statusCode = 400;
    res.send(
      "No se cumplió alguna condición de autor o mensaje: " + error.message
    );
  } else {
    fs.readFile("db.json", (err, data) => {
      let messages = data.toString();
      let json = JSON.parse(messages);
      let cambio = false;
      let count = 0;
      for (count; count < json.length; count++) {
        let comp = JSON.parse(JSON.stringify(json[count]));
        if (comp.ts == req.body.ts) {
          cambio = true;
          break;
        }
      }
      if (cambio) {
        fs.readFile("db.json", (err, data) => {
          if (err) console.log("error de lectura de DB");
          else {
            let content = data.toString();
            if (content.includes(JSON.stringify(json[count]))) {
              const newObj = {
                message: req.body.message,
                author: req.body.author,
                ts: req.body.ts,
              };
              content = content.replace(
                `,${JSON.stringify(json[count])}`,
                `,${JSON.stringify(newObj)}`
              );
              fs.writeFileSync("db.json", content);
              res.send(JSON.stringify(newObj));
            } else {
              res.send("Error de actualización de BD");
            }
          }
        });
      } else {
        res.statusCode = 400;
        res.send(
          "No hay mensaje con timestamp requerido entonces no pudo actualizarse"
        );
      }
    });
  }
});


router.delete('/chat/api/messages/:ts', function(req, res, next){
  fs.readFile("db.json", (err, data) => {
    let messages = data.toString();
    let json = JSON.parse(messages);  
    let existe = false;
    let count = 0;
    for(count; count<json.length; count++){
      let comp = JSON.parse(JSON.stringify(json[count]));
      if(comp.ts == req.params.ts){
        existe = true;
        break;
      }
    }
    if(existe){

      fs.readFile("db.json", (err, data) => {
        if(err)  console.log("error de lectura de DB");
        else {
          let content = data.toString();
          if(content.includes(JSON.stringify(json[count]))){
            
            content = content.replace(`,${JSON.stringify(json[count])}`, "");
            fs.writeFileSync("db.json", content);
            res.send("Se eliminó el mensaje correctamente");
          }
          else{
            res.send("Error en actualizacion de BD");
          }
        }
      });
      
    }
    else{
      res.statusCode = 400;
      res.send("No hay mensaje con timestamp requerido entonces no pudo borrarse");
    }
    
  });
});
*/
router.get("/chat/api/messages", function (req, res, next) {
  Message.findAll().then((result) => {
    console.log(result);
    res.send(result);
  });
});

router.get("/chat/api/messages/:ts", function (req, res, next) {
  Message.findOne({ where: { ts: req.params.ts } }).then((response) => {
    console.log(response);
    if (response === null)
      return res.status(404).send("No se encontro el mensaje");
    res.send(response);
  });
});

router.post("/chat/api/messages", function (req, res, next) {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
    ts: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.statusCode = 400;
    res.send(
      "No se cumplió alguna condición de autor o mensaje " + error.message
    );
  } else {
    Message.create({
      message: req.body.message,
      ts: req.body.ts,
      author: req.body.author,
    }).then((response) => {
      console.log(response);
      res.send(response);
    });

    ws.sendMessages();
  }
});

router.put("/chat/api/messages/:ts", function (req, res, next) {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .pattern(new RegExp("([A-Za-z0-9.-]+[ ][A-Za-z0-9. -]+)"))
      .required(),
    ts: Joi.required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    res.statusCode = 400;
    res.send(
      "No se cumplió alguna condición de autor o mensaje " + error.message
    );
  } else {
    Message.update(req.body, { where: { ts: req.params.ts } }).then(
      (response) => {
        if (response[0] !== 0) res.send({ message: "Mensaje actualizado" });
        else return res.status(404).send("No se encontró cliente");
      }
    );
  }
});

router.delete("/chat/api/messages/:ts", function (req, res, next) {
  Message.destroy({ where: { ts: req.params.ts } }).then((response) => {
    if (response === 0) res.status(404).send("Mensaje no encontrado");
    else res.send("Mensaje borrado");
  });
});

module.exports = router;
