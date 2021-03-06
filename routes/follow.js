var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('follow', { title: 'follow' });
});

var getStat = require('../functions/follow.js').getStat;
router.post('/', (req, res) => {
    console.log(req.body.ids);
  //console.log(req.body.data);
  var path = './public/'+req.body.name;
  console.log(path);
  if (getFileType(req.body.name) !== 'txt')
  return res.end('filetype');
  fs.writeFile(path, req.body.data, (err) => {
      if (err) return console.log(err);
      var main = require('../functions/follow.js').main;
      console.log(req.body.ids);
      main(path, req.body.ids);
  });
  

  
  res.end('success');
});

router.get('/stat', (req, res) => {
    res.end(getStat());
});

function getFileType(name) {
    return name && name.split('.')[name.split('.').length - 1];
}

module.exports = router;
