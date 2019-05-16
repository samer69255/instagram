var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var fs = require('fs');
    var txt = fs.readFileSync("./success.txt", "UTF-8");
  res.end(txt);
});

module.exports = router;
