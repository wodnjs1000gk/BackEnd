var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
/*
index.js와 마찬가지로 passport가 아닌 config/passport를
passport 변수에 담았습니다(상대주소라서 여긴 점이 두개입니다).
사실 두군대 중에 한군대만 config/passport를 require해 주면
되는데, 저는 그냥 passport는 무조건 config에서 가져오는 걸로
했습니다.
*/

// Home
router.get('/', function(req, res){
  res.render('home/welcome');
});
router.get('/about', function(req, res){
  res.render('home/about');
});

// Login
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));
/*
login form에서 보내진 post request를 처리해 주는 route입니다.
두개의 callback이 있는데, 첫번째 callback은 보내진 form의
validation을 위한 것으로 에러가 있으면 flash를 만들고
login view로 redirect합니다. 두번째 callback은
passport local strategy를 호출해서 authentication(로그인)을
진행합니다.
*/

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
