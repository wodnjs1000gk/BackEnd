// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:true},
  body:{type:String, required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;

/*
Post의 schema는 title, body, createdAt, updatedAt으로 구성이 되어 있습니다.

default 항목으로 기본 값을 지정할 수 있습니다.
함수명을 넣으면 해당 함수의 return이 기본값이 됩니다.
(Date.now는 현재시간을 리턴하는 함수입니다)
*/
