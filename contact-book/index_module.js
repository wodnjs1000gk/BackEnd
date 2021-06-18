var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
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
/*
DB schema, routes 부분의 코드가 없어지고 routes에는 app.use가 추가되었습니다.
분리된 routes(home, contacts)은 index.js의 app.use 함수에서 require를 통해
home.js, contacts.js와 연결됩니다. 기존의 DB schema는 route 파일안에서만
사용되기 때문에 index.js에서는 require를 하지 않고, 해당 route안에서 require됩니다.
*/
// Routes
app.use('/', require('./routes/home'));
app.use('/contacts', require('./routes/contacts'));
/*
app.use('route', 콜백_함수)는 해당 route에 요청이 오는 경우에만 콜백 함수를 호출합니다
*/
// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
