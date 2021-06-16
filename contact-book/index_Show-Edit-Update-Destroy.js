var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
/*
method-override module을 methodOverride변수에 담습니다.
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
/*
_method의 query로 들어오는 값으로 HTTP method를 바꿉니다.
예를들어 http://example.com/category/id?_method=delete를 받으면
_method의 값인 delete을 읽어 해당 request의 HTTP method를 delete으로 바꿉니다.
*/

// DB schema
var contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});
var Contact = mongoose.model('contact', contactSchema);

// Routes
// Home
app.get('/', function(req, res){
  res.redirect('/contacts');
});
// Contacts - Index
app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});
// Contacts - New
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});
// Contacts - show
app.get('/contacts/:id', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/show', {contact:contact});
  });
});
/*
"contacts/:id"에 get 요청이 오는 경우 :

:id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아
req.params에 넣게 됩니다. 예를 들어 "contacts/abcd1234"가 입력되면
"contacts/:id" route에서 이를 받아 req.params.id에 "abcd1234"를 넣게 됩니다.

Model.findOne은 DB에서 해당 model의 document를 하나 찾는 함수입니다.
첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후
콜백 함수를 호출합니다. Model.find와 비교해서 Model.find는
조건에 맞는 결과를 모두 찾아 array로 전달하는데 비해
Model.findOne은 조건에 맞는 결과를 하나 찾아 object로 전달합니다.
(검색 결과가 없다면 null이 전달됩니다.)

위 경우에는 {_id:req.params.id}를 조건으로 전달하고 있는데,
즉 DB의 contacts collection에서 _id가 req.params.id와 일치하는 data를
찾는 조건입니다.

에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render합니다.
*/
// Contacts - edit
app.get('/contacts/:id/edit', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/edit', {contact:contact});
  });
});
/*
"contacts/:id/edit"에 get 요청이 오는 경우 :

Model.findOne이 다시 사용되었습니다.
검색 결과를 받아 views/contacts/edit.ejs를 render합니다.
*/
// Contacts - update
app.put('/contacts/:id', function(req, res){
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts/'+req.params.id);
  });
});
/*
"contacts/:id"에 put 요청이 오는 경우 :

Model.findOneAndUpdate는 DB에서 해당 model의 document를 하나 찾아
그 data를 수정하는 함수입니다.
첫번째 parameter로 찾을 조건을 object로 입력하고 두번째 parameter로
update할 정보를 object로 입력data를 찾은 후 callback함수를 호출합니다.
이때 callback함수로 넘겨지는 값은 수정되기 전의 값입니다.
만약 업데이트 된 후의 값을 보고 싶다면 콜백 함수 전에 parameter로
{new:true}를 넣어주면 됩니다.

Data 수정 후 "/contacts/"+req.params.id로 redirect합니다.
*/
// Contacts - destroy
app.delete('/contacts/:id', function(req, res){
  Contact.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});
/*
"contacts/:id"에 delete 요청이 오는 경우 :

Model.deleteOne은 DB에서 해당 model의 document를 하나 찾아 삭제하는 함수입니다.
첫번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후
callback함수를 호출합니다.

Data 삭제후 "/contacts"로 redirect합니다.
*/
// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
