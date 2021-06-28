// /board/index_User-Error.js
/*
생성 과정(create)에서 에러가 있는 경우 생성 페이지(new)로,
수정 과정(update)에서 에러가 있는 경우 수정 페이지(edit)로
route간의 이동이 일어나는데, 이때 route간의 정보 전달을 위해
flash라는 것을 사용합니다.

flash는 변수처럼 이름과 값(문자열, 숫자, 배열, 객체 등등
어떠한 형태의 값이라도 사용 가능)을 저장할 수 있는데,
한번 생성 되면 사용될 때까지 서버 메모리상에 저장이 되어 있다가
한번 사용되면 사라지는 형태의 data입니다.

이 강의에서는 connect-flash package를 사용해서 flash를 만듭니다.

추가로 regex(Regular Expression, 정규표현식)를 사용하여
User의 username, password, name, email 항목들에게
특정한 형식의 값만 저장 할 수 있게 해봅시다
(email에는 email형식의 값만 받게 하고,
비밀번호는 영문자와 숫자를 혼용할 것 등등).
 regex는 문자열이 특정한 형식을 가지고 있는지 아닌지를 판단하기
위해 사용됩니다.
*/

/*
패키지 설치
express-session와 connect-flash package를 설치해 줍니다.
express-session은 connect-flash를 실행하기 위해 필요한
package입니다.

npm install --save express-session connect-flash
*/


var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
