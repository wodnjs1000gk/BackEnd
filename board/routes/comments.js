var express  = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var Post = require('../models/Post');
var util = require('../util');

// create
router.post('/', util.isLoggedin, checkPostId, function(req, res){
  /*
댓글을 달때는 post id가 필요한데, 이 post id를 route uri를 통해 받도록 하였습니다.
즉 [POST] /comments?postId=postId의 route으로 댓글을 생성합니다.
checkPostId 함수는 postId=postId가 있는지, 전달받은 post id가 실제 DB에
존재하는지를 확인하는 middle ware입니다.
  */
  var post = res.locals.post;
  /*
DB에서 찾은 post는 res.locals.post에 보관하여 다음 callback함수에서
계속해서 사용할 수 있도록 합니다.
  */

  req.body.author = req.user._id;
  req.body.post = post._id;
  /*
comment를 만드는데 필요하지만 form body에는 존재하지 않는
author와 post를 찾아서 넣어줍니다.
  */

  Comment.create(req.body, function(err, comment){
    if(err){
      req.flash('commentForm', { _id:null, form:req.body });
      req.flash('commentError', { _id:null, parentComment:req.body.parentComment, errors:util.parseError(err) });
      /*
comment의 flash들은 post의 flash들과는 다르게 _id 항목를 가지고,
form, errors와 같이 하위항목에 실제 form과 errors 데이터를 저장합니다.
post와는 달리 하나의 view 페이지에 여러개의 form이 생기기 때문인데요,
해당 flash 데이터들이 올바른 form을 찾을 수 있게 하기 위해서 입니다.
      */
    }
    return res.redirect('/posts/'+post._id+res.locals.getPostQueryString());
    /*
댓글이 생성된 후에는 해당 댓글의 게시물의 페이지로 돌아갑니다.
post와 관련된 query들을 함께 옮길 수 있도록 게시판 페이지 기능 만들기2 강의에서
만들었던 res.locals.getPostQueryString 함수도 사용합니다.
    */
  });
});

// update
router.put('/:id', util.isLoggedin, checkPermission, checkPostId, function(req, res){
  var post = res.locals.post;

  req.body.updatedAt = Date.now();
  Comment.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, comment){
    if(err){
      req.flash('commentForm', { _id: req.params.id, form:req.body });
      req.flash('commentError', { _id:req.params.id, parentComment:req.body.parentComment, errors:util.parseError(err) });
      /*
      댓글 생성과정에서 발생한 에러: _id항목의 값이 없고, parentComment항목에도 값이 없음
      대댓글 생성과정에서 발생한 에러: _id항목의 값이 없지만, parentComment항목에는 값이 있음
      댓글 수정과정에서 생성된 에러: _id항목의 값이 있고, parentComment항목에도 값이 있음
      */
    }
    return res.redirect('/posts/'+post._id+res.locals.getPostQueryString());
  });
});

// destroy
router.delete('/:id', util.isLoggedin, checkPermission, checkPostId, function(req, res){
  var post = res.locals.post;

  Comment.findOne({_id:req.params.id}, function(err, comment){
    if(err) return res.json(err);

    // save updated comment
    comment.isDeleted = true;
    comment.save(function(err, comment){
      if(err) return res.json(err);

      return res.redirect('/posts/'+post._id+res.locals.getPostQueryString());
    });
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Comment.findOne({_id:req.params.id}, function(err, comment){
    if(err) return res.json(err);
    if(comment.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}

function checkPostId(req, res, next){
  Post.findOne({_id:req.query.postId}, function(err, post){
    if(err) return res.json(err);

    res.locals.post = post;
    next();
  });
}
