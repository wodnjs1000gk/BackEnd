// index_mongoose_DB.js

var express = require('express');
var mongoose = require('mongoose');
var app = express();

// DB setting
/*
https://mongoosejs.com/docs/deprecations.html
더 이상 사용되지 않는 waring들을 수정하는 방법.
*/
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
/*
Mongoose 함수와 MongoDB 함수가 합쳐지면서 function이 재정립되면서
사용하지 않는 warning들이 발생함.
이 부분이 빠지게 되면 서버 실행 시 경고가 발생하므로
mongoose를 사용할 땐 웬만하면 항상 이렇게 세팅하고 사용하면 됨.
*/
mongoose.connect(process.env.MONGO_DB);
/*
https://www.a-mean-blog.com/ko/blog/%EB%8B%A8%ED%8E%B8%EA%B0%95%EC%A2%8C/_/mongoDB-Atlas-%EA%B0%80%EC%9E%85-%EB%B0%A9%EB%B2%95-%EB%AC%B4%EB%A3%8C-mongo-DB-%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C-%EC%84%9C%EB%B9%84%EC%8A%A4
https://www.a-mean-blog.com/ko/blog/Node-JS-%EC%B2%AB%EA%B1%B8%EC%9D%8C/%EC%A3%BC%EC%86%8C%EB%A1%9D-%EB%A7%8C%EB%93%A4%EA%B8%B0/Environment-Variable-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98
위 방법을 통해 Mongo DB를 환경변수에 저장했었기 때문에
node.js 코드 상에서 process.env.MONGO_DB로 해당 값을 불러올 수 있다.
mongoose.connect('CONNECTION_STRING')함수를 사용해서 DB를 연결할 수 있다.
*/
var db = mongoose.connection;
/*
mongoose의 DB object를 가져와 db 변수에 넣는 과정.
DB와 관련된 이벤트 리스터 함수들이 있음.
*/

db.once('open', function(){
  console.log('DB connected');
});
// db 연결 성공 시 DB connected 로그 출력
db.on('error', function(err){
  console.log('DB ERROR: ' + err);
});
// db 연결 중 에러 발생시 DB ERROR: err 로그 출력
/*
DB연결은 앱이 실행되면 단 한번만 일어나는 이벤트 이므로
그러므로 db.once('이벤트_이름',콜백_함수) 함수를 사용,
error는 DB접속시 뿐만 아니라, 다양한 경우에 발생할 수 있기 때문에
db.on('이벤트_이름',콜백_함수)함수를 사용
*/

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
