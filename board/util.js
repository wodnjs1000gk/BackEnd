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

module.exports = util;
