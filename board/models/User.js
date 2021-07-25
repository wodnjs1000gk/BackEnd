// board/models/User.js

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// schema
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,'Username is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    /*
match에는 regex(Regular Expression, 정규표현식)이 들어가서
값이 regex에 부합하는지 않으면 에러메세지를 내게 됩니다.
https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions
regex(/^.{4,12}$/)를 해석해 보면,
/^.{4,12}$/ : regex는 / /안에 작성합니다.
              즉 / /를 통해 이게 regex임을 알수 있습니다.
/^.{4,12}$/ : ^는 문자열의 시작 위치를 나타냅니다.
/^.{4,12}$/ : .는 어떠한 문자열이라도 상관없음을 나타냅니다.
/^.{4,12}$/ : {숫자1,숫자2}는 숫자1 이상, 숫자2 이하의 길이 나타냅니다.
/^.{4,12}$/ : $는 문자열의 끝 위치를 나타냅니다.
해석하면  "문자열의 시작 위치에 길이 4 이상 12 이하인 문자열이
있고, 바로 다음이 문자열의 끝이여야 함".
즉, 전체 길이가 4이상 12자리 이하의 문자열이라면
이 regex를 통과할 수 있습니다.
    */
    trim:true,
    // trim은 문자열 앞뒤에 빈칸이 있는 경우 빈칸을 제거해 주는 옵션입니다.
    unique:true
    },
    password:{
      type:String,
      required:[true,'Password is required!'],
      select:false
    },
    name:{
      type:String,
      required:[true,'Name is required!'],
      match:[/^.{4,12}$/,'Should be 4-12 characters!'],
      trim:true
    },
    email:{
      type:String,
      match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
    /*
/ / : regex의 시작과 끝을 나타냄.
^   : 문자열의 시작을 나타냄.
[ ] : 문자셋(Character Set). 이 중괄호 안에서는 어떤 문자도 특수문자가 아니라 일반적으로 처리된다.
[-] : 문자셋 속 하이픈. [a-d] = [abcd]
\.  : 특수문자 앞 백슬래쉬. \다음에 오는 문자는 특별하지 않고 문자 그대로 해석된다.
{2,}: 2자 이상이어야 한다.
    */
      trim:true
    }
},{
  toObject:{virtuals:true}
});
/*
schema : require 에 true 대신 배열([ ... ])이 들어갔습니다.
첫번째는 true/false 값이고, 두번째는 에러메세지입니다.
그냥 true/false을 넣을 경우 기본 에러메세지가 나오고,
위와 같이 배열을 사용해서 에러메세지 내용을 원하는 대로 변경할 수 있습니다.

password에는 select:false가 추가되었습니다.
select:false로 설정하면 DB에서 해당 모델을 읽어 올때
해당 항목값을 읽어오지 않습니다. 비밀번호는 중요하기 때문에 DB에서
값을 읽어오지 않게 설정했습니다. 물론 이 값이 필요한 경우도 있는데,
이럴 때는 해당 값을 읽어오도록 특별히 설정을 해주어야 합니다.
이 설정은 아래 route코드에서 설명합니다.
*/

// virtuals
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });
/*
DB에 저장되는 값 이외의 항목이 필요할 땐 virtual 항목으로 만듭니다.
즉 passwordConfirmation, originalPassword, currentPassword, newPassword는
회원가입, 회원정보 수정을 위해 필요한 항목이지만,
DB에 저장할 필요는 없는 값들입니다. 이처럼 DB에 저장될 필요는 없지만,
model에서 사용하고 싶은 항목들은 virtual로 만듭니다.
*/

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
/*
8-16자리 문자열 중에 숫자랑 영문자가 반드시 하나 이상
존재해야 한다는 뜻의 regex
*/
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
/*
에러메세지가 반복되므로 변수로 선언
*/
userSchema.path('password').validate(function(v) {
/*
password를 DB에 생성,
수정하기 전에 값이 유효(valid)한지 확인(validate)을 하는 코드를 작성합니다.
*/
  var user = this;
/*
validation callback 함수 속에서 this는 user model입니다.
헷갈리지 않도록 user 변수에 넣었습니다.
*/
  // create user
  if(user.isNew){
    /*
    model.isNew 항목은 해당 모델이 생성되는 경우에는 true,
    아니면 false의 값을 가집니다.
    이 항목을 이용해서 현재 password validation이 '회원가입' 단계인지,
    아니면 '회원 정보 수정'단계인지를 알 수 있습니다.
    */
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(!passwordRegex.test(user.password)){
      /*
정규표현식.test(문자열) 함수는 문자열에 정규표현식을 통과하는
부분이 있다면 true를, 그렇지 않다면 false를 반환합니다.
      */
          user.invalidate('password', passwordRegexErrorMessage);
          /*
if(!passwordRegex.test(user.password))에서
false가 반환되는 경우 미리 선언한 문자열로
model.invalidate함수를 호출
          */

    }
    else if(user.password !== user.passwordConfirmation) {
        user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
      }
    }
  /*
  회원가입의 경우 password confirmation값이 없는 경우와,
  password값이 password confirmation값과 다른 경우에
  유효하지않음처리(invalidate)를 하게 됩니다.
  model.invalidate함수를 사용하며, 첫번째는 인자로 항목이름,
  두번째 인자로 에러메세지를 받습니다.
  */

  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    /*
    bcrypt 의 compareSync함수를 사용해서 저장된 hash와
    입력받은 password의 hash가 일치하는지 확인합니다.
    bcrypt.compareSync(user.currentPassword, user.originalPassword)에서
    user.currentPassword는 입력받은 text값이고 user.originalPassword는
    user의 password hash값입니다. hash를 해독해서 text를 비교하는것이 아니라
    text값을 hash로 만들고 그 값이 일치하는 지를 확인하는 과정입니다.
    */
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    }
    else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
  /*
  회원 정보 수정의 경우 current password값이 없는 경우와,
  current password값이 original password값과 다른 경우,
  new password값과 password confirmation값이 다른 경우 invalidate합시다.
  회원정보 수정시에는 항상 비밀번호를 수정하는 것은 아니기 때문에
  new password와 password confirmation값이 없어도 에러는 아닙니다.
  */
});

// hash password
userSchema.pre('save', function (next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  }
  /*
  isModified함수는 해당 값이 db에 기록된 값과 비교해서 변경된 경우 true를,
  그렇지 않은 경우 false를 반환하는 함수입니다. user 생성시는 항상 true이며,
  user 수정시는 password가 변경되는 경우에만 true를 반환합니다.
  user.password의 변경이 없는 경우라면 이미 해당위치에 hash가 저장되어 있으므로
  다시 hash를 만들지 않습니다.
  */
  else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
  /*
  user를 생성하거나 user수정시 user.password의 변경이 있는 경우에는
  bcrypt.hashSync함수로 password를 hash값으로 바꿉니다.
  */
});
/*
Schema.pre함수는 첫번째 파라미터로 설정된 event가 일어나기 전(pre)에
먼저 callback 함수를 실행시킵니다.
"save" event는 Model.create, model.save 함수 실행시 발생하는 event입니다.
즉 user를 생성하거나 user를 수정한 뒤 save 함수를 실행 할 때 위의
callback 함수가 먼저 호출됩니다.
*/
// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};
/*
user model의 password hash와 입력받은 password text를 비교하는 method를
추가합니다. 이번 예제에 사용되는 method는 아니고 나중에 로그인을 만들때 될
method인데 bcrypt를 사용하므로 지금 추가해봤습니다.
*/

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;
