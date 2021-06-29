// board/index_login.js

/*
passport package를 사용해서 login 기능을 만들어 봅시다.
passport는 node.js에서 user authentication(사용자 인증, 즉 login)을 만들기 위해
널리 사용되는 package입니다. passport는 단독으로 사용할 수 없고,
passport strategy package와 함께 사용해야 합니다. passport package는
인증 시스템을 위한 bass package이며, passport strategy package는
구체적인 인증 방법을 구현하는 package입니다.

이렇게 package가 나눠진 이유는 passport strategy package 가 인증 방법별로
수십가지(Facebook strategy, Twitter strategy, 심지어 Naver strategy도 있습니다)
가 되기 때문인데, 실제 한 사이트에서 사용하는 strategy는 그 중에 몇 개밖에 안됩니다.
즉 사이트에 필요한 인증 방법만 설치하기 위해서 package를 분리한 것입니다.

이번 포스팅에서는 입력받은 username, password과 DB에 존재하는 data의 값을
비교해서 login을 하는 local strategy를 사용하며 따라서 passport package와
passport-local package 두가지를 설치해 주어야 합니다.

로그인의 기본 원리
웹 프로그램에서 server와 client간의 정보교환은 단발성입니다.
사용자의 browser(client)에서 주소가 입력되거나, link가 click이 되면 server로
요청(request)이 전달되고, server는 요청에 맞는
결과를 응답(response)하게 되는 것이죠.

이렇듯 server와 client의 통신은 연결을 유지하고 있지 않기 때문에 client를
구별하기 위해서는 각각의 request에 고유한 식별코드가 필요합니다.
이 식별코드는 사이트에 처음 접속하는 순간 생성이 되어 client의 브라우저에 저장이
되고, server에 요청을 할때마다 같이 server로 전달됩니다.
서버에는 이 식별코드가 session에 저장되어 어느 client로 부터 요청이 오는지를
구별할 수 있게 됩니다.

로그인을 성공하게 되면 server의 session에 기록이 되고 다음번 request부터는
로그인한 상태로 인식하게 됩니다.

로그인은 DB에 이미 등록되어 있는 user를 찾는 것인데, 로그인시에 DB로 부터 user를
찾아 session에 user 정보의 일부(간혹 전부)를 등록하는 것을 serialize라고 합니다.
반대로 session에 등록된 user 정보로부터 해당 user를 object로 만드는 과정을
deserialize라고 하며, server에 요청이 올때마다 deserialize를 거치게 됩니다.
*/

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
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
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
