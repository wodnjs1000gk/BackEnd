var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  views:{type:Number, default:0},
  numId:{type:Number},
  attachment:{type:mongoose.Schema.Types.ObjectId, ref:'file'},
<<<<<<< HEAD
=======
  /*
  file와 post의 관계를 만들어주는 부분입니다.
  post의 file ref(reference)는 현재 게시물이 가지고 있는 file을 ref로 가지고 있는 것이고,
  file의 post ref는 생성될 당시의 post를 ref로 가집니다.

  즉, 게시물에 파일이 첨부되었다가 첨부파일을 새로 업로드하게 되면 post는 두번째 업로드된
  파일만 ref로 가지게 됩니다. 이때 만약 file에 post ref가 없다면 첫번째 업로드된 파일은
  어느 post를 위해 업로드되었는지 그 정보를 잃거 되므로 postId를 따로 기록하는 것입니다. 
  */
>>>>>>> 15f15512e7db351a4c00e7b81cd243bf4d58bc9e
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
});
/*
post schema에 author를 추가해 줍니다.
또한 ref:'user'를 통해 이 항목의 데이터가 user collection의 id와 연결됨을
mongoose에 알립니다. 이렇게 하여 user의 user.id와 post의 post.author가
연결되어 user와 post의 relationship이 형성되었습니다.
*/

postSchema.pre('save', async function (next){
  var post = this;
  if(post.isNew){
    counter = await Counter.findOne({name:'posts'}).exec();
    if(!counter) counter = await Counter.create({name:'posts'});
    counter.count++;
    counter.save();
    post.numId = counter.count;
  }
  return next();
});
/*
Schema.pre함수는 첫번째 파라미터로 설정된 event가 일어나기
전(pre)에 먼저 callback 함수를 실행시킵니다.
"save" event는 Model.create, model.save함수 실행시
발생하는 event입니다.

새 post가 생성되는 경우(post.isNew가 true)에만 'posts'
counter를 읽어오고, 숫자를 증가시키고, post의 numId에
counter를 넣어줍니다. 만약 'posts' counter가 존재하지
않는다면 생성합니다.
*/

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;
