var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var util = require('./util');
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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users', require('./routes/users'));
/*
util.getPostQueryString미들웨어를 posts route이 request되기 전에 배치하여
모든 post routes에서 res.locals.getPostQueryString를 사용할 수 있게 하였습니다.
*/

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});

/*
board2-4 - author search, highlight

작성자 검색 기능을 추가하고, 게시판의 검색 결과에 검색어를
하이라이트해주는 기능을 추가해 봅시다.

작성자 검색은 작성자의 username 정확히 일치하는 경우와 작성자의
username이 일부만 일치하는 경우로 나눌텐데, 전자를 'author!',
후자를 'author'로 searchType query string에 전달합니다.

검색어 하일라이트하는 기능은 서버에서 해당 기능을 수행하는 것이 아니라,
query string의 searchType, searchText를 사용하여 클라이언트 웹 브라우저에서
자바스크립트로 해당 부분을 찾아 css 스타일을 변경하는 방법으로 만들어 봅시다.
*/
