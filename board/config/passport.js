var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/*
strategy들은 거의 대부분이 require다음에 .Strategy가 붙습니다.
.Strategy없이 사용해도 되는 것도 있는데,
다들 붙여주니까 같이 붙여줍시다.
꼭 붙여야 된다거나, 혹은 다른 단어가 붙는 경우도 있는데,
이런건 https://www.npmjs.com 에서 해당 package를 검색한 후
해당 package의 공식 문서에서 확인할 수 있습니다.
*/
var User = require('../models/User');

// serialize & deserialize User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});
/*
passport.serializeUser함수는 login시에 DB에서 발견한 user를
어떻게 session에 저장할지를 정하는 부분입니다.
user정보 전체를 session에 저장할 수도 있지만,
session에 저장되는 정보가 너무 많아지면 사이트의 성능이
떨어질 수 있고, 회원정보수정을 통해 user object가 변경되더라도
이미 전체 user정보가 session에 저장되어 있으므로 해당 부분을
변경해 주어야하는 등의 문제들이 있으므로 user의 id만 session에
저장합니다.
*/
/*
passport.deserializeUser함수는 request시에 session에서
어떻게 user object를 만들지를 정하는 부분입니다.
매번 request마다 user정보를 db에서 새로 읽어오는데,
user가 변경되면 바로 변경된 정보가 반영되는 장점이 있습니다.
다만 매번 request마다 db에서 user를 읽어와야 하는 단점이 있습니다.
user정보를 전부 session에 저장하여 db접촉을 줄이거나,
아니면 request마다 user를 db에서 읽어와서 데이터의 일관성을
확보하거나 자신의 상황에 맞게 선택하시면 됩니다.
*/

// local strategy
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      /*
만약 로그인 form의 username과 password항목의 이름이 다르다면
여기에서 값을 변경해 주면 됩니다. 사실 이 코드에서는 해당 항목
이름이 form과 일치하기 때문에 굳이 쓰지 않아도 됩니다.
예를들어 로그인 form의 항목이름이 email, pass라면
usernameField : "email", passwordField : "pass"로 해야 합니다.
      */
      passReqToCallback : true
    },
    function(req, username, password, done) {
      /*
로그인 시에 이 함수가 호출됩니다. DB에서 해당 user를 찾고,
user model에 설정했던 user.authenticate 함수를 사용해서
입력받은 password와 저장된 password hash를 비교해서 값이
일치하면 해당 user를 done에 담아서 return하고
(return done(null, user);), 그렇지 않은 경우 username flash와
에러 flash를 생성한 후 done에 false를 담아 return합니다.
(return done(null, false);) user가 전달되지 않으면
local-strategy는 실패(failure)로 간주됩니다.
      */
      User.findOne({username:username})
        .select({password:1})
        .exec(function(err, user) {
          if (err) return done(err);

          if (user && user.authenticate(password)){
            /*
user.authenticate(password)는 입력받은 password와 db에서
읽어온 해당 user의 password hash를 비교하는 함수로 게시판 -
계정 비밀번호 암호화(bcrypt) 강의에서 bcrypt로 만든 함수입니다.
            */
            return done(null, user);
            /*
참고: done함수의 첫번째 parameter는 항상 error를 담기 위한
것으로 error가 없다면 null을 담습니다.
            */
          }
          else {
            req.flash('username', username);
            req.flash('errors', {login:'The username or password is incorrect.'});
            return done(null, false);
          }
        });
    }
  )
);

module.exports = passport;
