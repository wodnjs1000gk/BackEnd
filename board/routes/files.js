// routes/files.js

var express  = require('express');
var router = express.Router();
var File = require('../models/File');

router.get('/:serverFileName/:originalFileName', function(req, res){
  /*
  :을 사용해 server의 파일 이름(server file name)과 업로드될 당시의 파일 이름
  (original file name)을 파라메터로 받는 file route입니다.
  */
  File.findOne({serverFileName:req.params.serverFileName, originalFileName:req.params.originalFileName}, function(err, file){ // 3-1
    if(err) return res.json(err);

    var stream = file.getFileStream(); 
    if(stream){
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + file.originalFileName
      });
      stream.pipe(res);
    }
    else {
      res.statusCode = 404;
      res.end();
    }
  });
});

module.exports = router;
