// routes/posts.js

var express  = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');
// 게시판 - User Error 처리에서 변경된 것과 동일하게 변경되었습니다.

/*
// Index ~ normal board
router.get('/', function(req, res){
  Post.find({})
  .populate('author')
  .sort('-createdAt')
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render('posts/index', {posts:posts});
  });
});
*/
/*
Model.populate()함수는 relationship이 형성되어 있는 항목의 값을 생성해 줍니다.
현재 post의 author에는 user의 id가 기록되어 있는데,
이 값을 바탕으로 실제 user의 값을 author에 생성하게 됩니다.
*/
/*
find와 function 사이에 sort함수가 들어간 형태.
나중에 생성된 data가 위로 오도록 정렬.
원래 모양 -> 바뀐 모양
Post.find({}, function(err, posts){ ... }); ->
Post.find({})
  .sort('-createdAt')
  .exec(function(err, posts){ ... });

사실 원래모양 역시
Post.find({})
  .exec(function(err, posts){ ... });
를 줄인 표현임.
.exec함수 앞에 DB에서 데이터를 어떻게 찾을지,
어떻게 정렬할지 등등을 함수로 표현하고,
exec안의 함수에서 해당 data를 받아와서 할일을 정하는 구조
*/
/*
.sort()함수는 string이나 object를 받아서 데이터 정렬방법을 정의하는데,
문자열로 표현하는 경우 정렬할 항목명을 문자열로 넣으면 오름차순으로 정렬하고,
내림차순인 경우 -를 앞에 붙여줌.
두가지 이상으로 정렬하는 경우 빈칸을 넣고 각각의 항목을 적어주면 됨.
object를 넣는 경우 {createdAt:1}(오름차순), {createdAt:-1}(내림차순)
*/

// Index
router.get('/', async function(req, res){
  var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:10;

  var skip = (page-1)*limit;
  var count = await Post.countDocuments({});
  var maxPage = Math.ceil(count/limit);
  var posts = await Post.find({})
    .populate('author')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .exec();

  res.render('posts/index', {
    posts:posts,
    currentPage:page,
    maxPage:maxPage,
    limit:limit
  });
});

// New
router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
  var post = req.flash('post')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('posts/new', { post:post, errors:errors });
});
/*
new, create, edit, update, destroy route에 util.isLoggedin를
사용해서 로그인이 된 경우에만 해당 route을 사용할 수 있습니다.
즉 게시물 목록(index)을 보는 것과, 게시물 본문을 보는 것(show)
외의 행동은 login이 되어야만 할 수 있습니다.
*/

// create
router.post('/', util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  //글을 작성할때는 req.user._id를 가져와서 post의 author에 기록합니다.
  //req.user는 로그인을 하면 passport에서 자동으로 생성해 줍니다.
  Post.create(req.body, function(err, post){
    if(err){
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/new');
    }
    res.redirect('/posts');
  });
});
/*
edit, update, destroy route에 checkPermission를 사용해서
본인이 작성한 post인 경우에만 계속 해당 route을 사용할 수
있습니다.
*/

// show
router.get('/:id', function(req, res){
  Post.findOne({_id:req.params.id})
    .populate('author')
    .exec(function(err, post){
      if(err) return res.json(err);
      res.render('posts/show', {post:post});
    });
});
// index와 마찬가지로 show에도 .populate()함수를 추가하였습니다.

// edit
router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
  var post = req.flash('post')[0];
  var errors = req.flash('errors')[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        res.render('posts/edit', { post:post, errors:errors });
      });
  }
  else {
    post._id = req.params.id;
    res.render('posts/edit', { post:post, errors:errors });
  }
});

// update
router.put('/:id', util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/'+req.params.id+'/edit');
    }
    /*
board08 - Post Error에서 Post.findOneAndUpdate에
{runValidators:true}이 추가되었습니다..
findOneAndUpdate는 기본설정이 schema에 있는 validation을
작동하지 않도록 되어 있기때문에 이 option을 통해서
validation이 작동하도록 설정해 주어야 합니다.
    */
    res.redirect('/posts/'+req.params.id);
  });
});

// destroy
router.delete('/:id', util.isLoggedin, checkPermission, function(req, res){
  Post.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/posts');
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}
/*
Post에서checkPermission함수는 해당 게시물에 기록된 author와
로그인된 user.id를 비교해서 같은 경우에만 계속 진행(next())하고,
만약 다르다면 util.noPermission함수를 호출하여 login 화면으로
돌려보냅니다.
*/
