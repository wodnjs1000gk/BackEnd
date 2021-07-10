// util.js

/*
원래 routes/users.js에 있던 parseError함수를 module로 만들어
util.js 파일로 분리했습니다. 이처럼 여러 곳에서 공통으로 쓰게 될
함수들은 앞으로 util.js파일에 기록합니다
*/
var util = {};

util.parseError = function(errors){
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
};

// 모든 route에서 공용으로 사용될 isLoggedin, noPermission함수를
// util.js에 만듭니다.
util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/login');
  }
};
/*
isLoggedin함수는 사용자가 로그인이 되었는지 아닌지를 판단하여
로그인이 되지 않은 경우 사용자를 에러 메세지
("Please login first")와 함께 로그인 페이지로 보내는 함수입니다.

route에서 callback으로 사용될 함수이므로req, res, next를
받습니다. 로그인이 된 상태라면 다음 callback함수를 호출하게 되고,
로그인이 안된 상태라면 로그인 페이지로 redirect합니다.
*/

util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
};
/*
noPermission함수는 어떠한 route에 접근권한이 없다고 판단된
경우에 호출되어 에러 메세지("You don't have permission")와 함께
로그인 페이지로 보내는 함수입니다.req, res가 있지만
callback으로 사용하지는 않고 일반 함수로 사용할 예정입니다.
isLoggedin과 다르게 접근권한이 있는지 없는지를 판단하지는 않는데,
상황에 따라서 판단 방법이 다르기 때문입니다.
*/

util.getPostQueryString = function(req, res, next){
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  };
  next();
};


module.exports = util;
