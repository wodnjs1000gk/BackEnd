var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
});
// post schema의 커스텀 에러메세지들이 추가되었습니다.
/*
post schema에 author를 추가해 줍니다.
또한 ref:'user'를 통해 이 항목의 데이터가 user collection의 id와 연결됨을
mongoose에 알립니다. 이렇게 하여 user의 user.id와 post의 post.author가
연결되어 user와 post의 relationship이 형성되었습니다.
*/
// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;
