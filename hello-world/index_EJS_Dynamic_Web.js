// index.js

var express = require('express');
var app = express();

// 정적 파일 제공하기
app.set('view engine','ejs');
// ejs를 사용하기 위해서 express의 view engine에 ejs를 set
app.use(express.static(__dirname + '/public'));
/*
express 변수에는 stastic이라는 메서드가 포함되어있습니다.
이 메서드를 미들웨어로서 로드해줍니다.
static의 인자로 전달되는 'public'은 디렉터리의 이름입니다.
따라서 'public' 이라는 디렉터리 밑에 있는 데이터들은
웹브라우저의 요청에 따라 서비스를 제공해줄 수 있습니다.
*/

/*
두 폴더를 허용하고 싶은 경우는 다음과 같이 미들웨어를 두 번 사용하면 됩니다.
app.use(express.static('public'));
app.use(express.static('files'));
*/

/*
가상 경로를 이용하여 접근하도록 하려면 다음과 같이 사용해주면 됩니다.
app.use('/static', express.static('public'));

가상 경로를 사용한 경우,
사용자가 public 디렉터리에 있는 파일들에 접근하려면 다음과 같이 접근해야 합니다.

http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
*/

app.get('/hello', function(req,res){
  res.render('hello', {name:req.query.nameQuery});
});
// query를 통해 이름을 받는 코드. 모든 query는 req.query에 저장됨
/*
Node.js에서 js파일 상의 로직으로 변경되는 값을 HTML로 쏴주는 것이 EJS이다.
이때 서버를 담당하는 entry point에서 EJS로 데이터를 전송하는 역할을 하는 함수가
render()함수이다.

만약 EJS를 사용하지 않고 기본적인 HTML만을 사용한다면,
클라이언트로부터 온 request에 대한 response를 일일이
send 또는 sendFile 해야할 것이다.
*/

app.get('/hello/:nameParam', function(req,res){
  res.render('hello', {name:req.params.nameParam});
});
/*
route parameter를 통해 이름을 받는 코드입니다.
콜론(:)으로 시작되는 route은 해당 부분에 입력되는
route의 텍스트가 req.params에 저장됩니다.
예를들어 /hello/Kim을 입력하면 "/hello/:nameParam"에 의해
세미콜론이 있는 route의 2번째 부분 즉, Kim이 req.params.nameParam으로 저장됩니다.
*/

/*
ejs파일을 사용하기 위해서는 res.render 함수를 사용해야 하며,
첫번째 parameter로 ejs의 이름을,
두번째 parameter로 ejs에서 사용될 object를 전달합니다.
res.render 함수는 ejs를 /views 폴더에서 찾으므로
views폴더의 이름은 변경되면 안됩니다.
*/

var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
