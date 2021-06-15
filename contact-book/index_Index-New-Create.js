var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
/*
body-parser는 node.js 모듈입니다.
클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출합니다.
다음과 같은 데이터를 body에 담아 POST request 를 보내고자 합니다.
{
  userID : "힝",
  password : "나도몰라"
}
서버단에서 express를 써서 POST request를 처리하는 방법은 다음과 같습니다.
var express = require('express')
var app = express()
app.post('/profile', function(req, res) => {
  console.log(req.body)
})
그런데, 위 코드 기준 4번째 줄 console.log(req.body) 라인에서
undefined Error를 마주하게 됩니다.
req.body는 body-parser를 사용하기 전에는 디폴트 값으로 Undefined이
설정되기 때문입니다. (출처: Express Docs)
*/
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
/*
아래는 bodyParser를 사용하기 위해 필요한 코드들입니다.
2번은 json 형식의 데이터를 받는다는 설정이고,
3번은 urlencoded data를 extended 알고리듬을 사용해서 분석한다는 설정입니다.
2번을 설정하면, route의 callback함수(function(req, res, next){...})의
req.body에서 form으로 입력받은 데이터를 사용할 수 있습니다.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// DB schema
var contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});
/*
Schema(스키마)는 모델의 대상에 대한 구체적인 구조를 뜻합니다.
mongoose.Schema 함수로 DB에서 사용할 schema를 설정합니다. 데이터베이스에 정보를 어떠한 형식으로 저장할 지를 지정해 주는 부분입니다.
contact라는 형태의 데이터를 DB에 저장할 텐데,
이 contact는 name, email, phone의 항목들을 가지고 있으며
새 항목 모두 String 타입입니다. name은 값이 반드시 입력되어야 하며(required),
값이 중복되면 안된다(unique)는 추가 설정이 있습니다.

이 예제에서는String만 사용했지만, 필요에 따라 Number, Date, Boolean 등등
다양한 타입들을 설정할 수 있습니다. 스키마의 타입과 추가 설정들에 대해서
자세히 알아보려면 공식사이트의 해당 페이지
(http://mongoosejs.com/docs/schematypes.html)를 읽어보세요.
*/

var Contact = mongoose.model('contact', contactSchema);
/*
mongoose.model함수를 사용하여 contact schema의 model을 생성합니다.
mongoose.model함수의 첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름이며,
두번째는 mongoose.Schema로 생성된 오브젝트입니다.
DB에 있는 contact라는 데이터 콜렉션을
현재 코드의 Contact라는 변수에 연결해 주는 역할을 합니다.
생성된 Contact object는 mongoDB의 contact collection의 model이며
DB에 접근하여 data를 변경할 수 있는 함수들을 가지고 있습니다.
*/

// Routes
// Home
app.get('/', function(req, res){
  res.redirect('/contacts');
});
/*
"/"에 get 요청이 오는 경우 :
/contacts로 redirect하는 코드
*/
// Contacts - Index
app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});
/*
"/contacts"에 get 요청이 오는 경우 :
에러가 있다면 에러를 json형태로 웹브라우저에 표시하고,
에러가 없다면 검색 결과를 받아 views/contacts/index.ejs를
render(페이지를 다이나믹하게 제작)

Contact.find({}, function(err, contacts){ ... })를 살펴봅시다.
이 부분을 일반화시키면 모델.find(검색조건, callback_함수)로 나타낼 수 있습니다.
- 모델.find 함수는 DB에서 검색조건에 맞는 모델(이 강의에서는 Contact)
  data(배열)를 찾고 콜백_함수를 호출하는 함수입니다.
- 모델.find의 검색조건은 Object 형태로 전달됩니다.
  예를들어 {lastName:"Kim"}이라면 모델들 중에 lastName 항목의 값이
  "Kim"인 모델들을 찾는 조건이 됩니다. 빈 Object({})를
  전달하는 경우(=검색조건 없음) DB에서 해당 모델의 모든 data를 return합니다.
- 모델.find의 콜백_함수는 function(에러, 검색결과)의 형태입니다
  (function(err, contacts){ ... } 부분). 첫번째 parameter인
  에러(여기서는 err)는 error가 있는 경우에만 내용이 전달됩니다.
  즉 if(err)로 에러가 있는지 없는지를 알 수 있습니다.
  두번째 parameter인 검색결과(여기서는 contacts)는 한개 이상일 수
  있기 때문에 검색결과는 항상 array이며 심지어 검색 결과가 없는 경우에도
  빈 array[]를 전달합니다. 검색결과가 array임을 나타내기 위해
  parameter이름으로 contact의 복수형인 contacts를 사용합니다.
# res.render("ejs파일경로", {데이터이름표: 전송할데이터})
*/

// Contacts - New
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
/*
"/contacts/new"에 get 요청이 오는 경우 :
새로운 주소록을 만드는 form이 있는 views/contacts/new.ejs를 render
*/
// Contacts - create
app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});
/*
"/contacts"에 post 요청이 오는 경우 :
"/contacts/new"에서 폼을 전달받는 경우입니다.
모델.create은 DB에 data를 생성하는 함수입니다.
첫번째 parameter로 생성할 data의 object(여기서는 req.body)를 받고,
두번째 parameter로 콜백 함수를 받습니다.
모델.create의 callback 함수(여기서는 function(err, contact){ ... } 부분) 은
첫번째 parameter로 error를 받고 두번째 parameter로 생성된 data를 받습니다.
생성된 data는 항상 하나이므로 parameter이름으로
단수형인 contact를 사용하였습니다.
에러없이 contact data가 생성되면 /contacts로 redirect합니다.
*/

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
