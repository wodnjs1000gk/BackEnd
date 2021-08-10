// models/File.js

var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
/*
fs는 File System의 약어로 컴퓨터의 파일을 조작할 수 있는 node module입니다.
package를 따로 설치할 필요없이 node.js에서 기본적으로 제공됩니다.

path 역시 node.js에서 기본적으로 제공되며, 폴더및 파일의 path를 조작할 수 있습니다.
*/

// schema
var fileSchema = mongoose.Schema({
  originalFileName:{type:String},
  serverFileName:{type:String},
  size:{type:Number},
  uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  postId:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
  isDeleted:{type:Boolean, default:false},
});
/*
originalFileName: 업로드된 파일명입니다.
serverFileName: 같은 이름의 파일이 업로드되는 경우를 대비하여 모든 업로드된 파일은 파일명이
                바뀌어 저장됩니다. 실제 서버에 저장된 파일 이름을 저장합니다.
size: 업로드된 파일의 크기입니다.
uploadedBy: 어느 user에 의해 업로드되었는지를 기록합니다. 파일업로드는 로그인 된 유저에게만
            혀용되므로 required가 추가되었습니다.
postId: 이 파일이 어느 post와 관련있는지를 기록합니다. 아마 나중에 게시판이외의 경로로
        업로드되는 경우가 있을것 같아서 required는 하지 않았습니다.
isDeleted: comment와 마찬가지로 파일을 지우는 경우에 실제 파일이나 DB의 file 데이터를 지우지
            않고 isDeleted를 이용하여 처리합니다.
*/

// instance methods
fileSchema.methods.processDelete = function(){
  this.isDeleted = true;
  this.save();
};
/*
삭제요청을 처리합니다. 실제 파일을 지우지는 않고, file의 isDeleted항목을
true로 변경하여 저장하는 일만 합니다.
*/
fileSchema.methods.getFileStream = function(){
  var stream;
  var filePath = path.join(__dirname,'..','uploadedFiles',this.serverFileName); 
  var fileExists = fs.existsSync(filePath);
  if(fileExists){
    stream = fs.createReadStream(filePath);
  }
  else {
    this.processDelete();
  }
  return stream;
};
/*
서버 파일의 스트림(stream)을 생성하여 return합니다.
스트림은 binary 데이터를 조작할 수 있는 다리로 생각하면 됩니다.
일단 컴퓨터에 있는 binary 파일을 프로그램에서 읽거나 수정하려면
스트림이라는 것을 만들어야 한다는 것만 꼭 기억해 줍시다.
*/

// model & export
var File = mongoose.model('file', fileSchema);

// model methods
File.createNewInstance = async function(file, uploadedBy, postId){ // 2
  return await File.create({
      originalFileName:file.originalname,
      serverFileName:file.filename,
      size:file.size,
      uploadedBy:uploadedBy,
      postId:postId,
    });
};
/*
createNewInstance함수는 file, uploadedBy, postId를 받아 file모델의 객체을 DB에 생성하고
생성한 객체(인스턴스)를 리턴합니다. 함수에 전달되는 file 인자는 multer로 생성된 file 정보가
들어있는 객체인데요, 이 file 객체의 구조는 multer의 공식 npm 페이지
(https://www.npmjs.com/package/multer#file-information) 에서 볼 수도 있고,
아니면 console.log나 디버깅으로 직접 살펴볼 수도 있습니다.
*/

module.exports = File;
