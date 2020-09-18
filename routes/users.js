var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/messages', function(req, res, next) {
  console.log(res.body);
  res.send(res.body);
});

router.post('/messages', function(req, res, next) {

  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
