var mongoose = require('mongoose');

// schema
var commentSchema = mongoose.Schema({
  post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  /*
댓글에는 작성자가 있고, 댓글이 달리게 되는 게시물있습니다.
각각 user와 post를 연결하여 관계를 형성해 줍니다.
댓글에 이 둘은 반드시 필요하므로 required:true를 달아줍니다.
  */
  parentComment:{type:mongoose.Schema.Types.ObjectId, ref:'comment'},
  /*
대댓글은 다른 댓글에 달리게 되므로 댓글과 댓글간의 관계 형성이 필요합니다.
이처럼 자기 자신의 모델을 자신의 항목으로 가지는 것을
self referencing relationship이라고 합니다.
또한 댓글-대댓글은 동일한 모델이 상하관계를 가지게 되는데 이때 상위에 있는 것을
부모(parent)라고 하고, 하위에 있는 것을 자식(child)이라고 부릅니다.
그래서 parentComment라는 항목을 추가하여 대댓글인 경우 어느 댓글에 달린
댓글인지를 표시하였습니다. 대댓글이 아니고 게시물에 바로 달리는 댓글은
부모 댓글이 없으므로 required는 필요하지 않습니다.
  */
  text:{type:String, required:[true,'text is required!']},
  isDeleted:{type:Boolean},
  /*
게시물-댓글-대댓글-대댓글... 이런식으로 구조가 형성될 텐데,
만약 중간 댓글이 완전히 삭제되어 버리면 하위 댓글들이 부모를 잃고 고아가 됩니다
(농담이 아니라 진짜 고아(orphaned)라고 표현합니다).
이를 방지하기 위해 진짜로 DB에서 댓글 데이터를 지우는 것이아니라,
isDeleted: true 로 표시해 웹사이트 상에는 표시되지 않게 합니다.
  */
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

commentSchema.virtual('childComments')
  .get(function(){ return this._childComments; })
  .set(function(value){ this._childComments=value; });
  /*
DB상에는 대댓글의 부모정보만 저장하지만, 웹사이트에 사용할 때는 부모로부터
자식들을 찾아 내려가는 것이 더 편리하기 때문에 자식 댓글들의 정보를 가지는
항목을 가상(virtual) 항목으로 추가하였습니다.
  */

// model & export
var Comment = mongoose.model('comment',commentSchema);
module.exports = Comment;
