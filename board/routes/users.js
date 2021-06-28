// board/routes/users.js

var express = require('express');
var router = express.Router();
var User = require('../models/User');
/*
나머지는 지금까지 만들어 왔던 route들과 기본 형태는 같습니다.
다만 id대신에 username을 route에 사용하였는데요,
그냥 id말고 다른 항목도 route에 사용할 수도 있다는 것을 보여주기 위함입니다.
*/

// Index
router.get('/', function(req, res){
  User.find({})
    .sort({username:1})
    .exec(function(err, users){
      if(err) return res.json(err);
      res.render('users/index', {users:users});
    });
});
/*
지금까지의 index route과는 다르게, 찾은 값을 정렬하는 기능이 추가되었습니다.
sort함수가 추가되었는데요, 이 함수에는 {username:1} 이 들어가서
username을 기준으로 오름차순(asc)으로 정렬하고 있습니다.
(-1을 넣으면 내림차순(desc)이 됩니다.)
*/

// New
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user:user, errors:errors });
});

// create
router.post('/', function(req, res){
  User.create(req.body, function(err, user){
    if(err){
      req.flash('user', req.body);
      req.flash('errors', parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/users');
  });
});


// show
router.get('/:username', function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});

// edit
router.get('/:username/edit', function(req, res){
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if(!user){
    User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render('users/edit', { username:req.params.username, user:user, errors:errors });
    });
  }
  else {
    res.render('users/edit', { username:req.params.username, user:user, errors:errors });
  }
});

// update
router.put('/:username', function(req, res, next){
  User.findOne({username:req.params.username})
  /*
  이번에는 findOneAndUpdate함수대신에 findOne함수로 값을 찾은 후에 값을
  수정하고 user.save함수로 값을 저장합니다. 단순히 값을 바꾸는 것이 아니라
  user.password를 조건에 맞게 바꿔주어야 하기 때문이죠.
  */
    .select('password')
    /*
    select함수를 이용하면 DB에서 어떤 항목을 선택할지, 안할지를 정할 수 있습니다.
    user schema에서 password의 select을 false로 설정했으니
    DB에 password가 있더라도 기본적으로 password를 읽어오지 않게 되는데,
    select('password')를 통해서 password를 읽어오게 했습니다.
    참고로 select함수로 기본적으로 읽어오게 되어 있는 항목을
    안 읽어오게 할 수도 있는데 이때는 항목이름 앞에 -를 붙이면 됩니다.
    또한 하나의 select함수로 여러 항목을 동시에 정할 수도 있는데,
    예를 들어 password를 읽어오고, name을 안 읽어오게 하고 싶다면
    .select('password -name')를 입력하면 되겠습니다.
    */
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword? req.body.newPassword : user.password;
      /*
      user의 update(회원 정보 수정)은 password를 업데이트 하는 경우와,
      password를 업데이트 하지 않는 경우로 나눌 수 있는데,
      이에 따라 user.password의 값이 바뀝니다.
      */
      for(var p in req.body){
        user[p] = req.body[p];
      }
      /*
      user는 DB에서 읽어온 data이고, req.body가 실제 form으로 입력된 값이므로
      각 항목을 덮어 쓰는 부분입니다
      */

      // save updated user
      user.save(function(err, user){
        if(err){
          req.flash('user', req.body);
          req.flash('errors', parseError(err));
          return res.redirect('/users/'+req.params.username+'/edit');
        }
        res.redirect('/users/'+user.username);
      });
  });
});

// destroy
router.delete('/:username', function(req, res){
  User.deleteOne({username:req.params.username}, function(err){
    if(err) return res.json(err);
    res.redirect('/users');
  });
});

module.exports = router;

// functions
function parseError(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}
