//index.js

// require(모듈_이름) 함수는 node.js에서 기본적으로 주어지는 함수로,
// modules폴더 안에 설치된 모듈을 불러오는 함수입니다.
var express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담음
// express 모듈을 express 변수에 담고, express()로 app object를 초기화 하는 것은
// Express framework에서 항상 가장 처음하는 것이므로 따라해 줍니다.
var app = express(); // express를 실행하여 app object를 초기화

// app.get, app.listen은 해당부분의 코드가 index.js 실행시 바로 실행되는 것이 아니라,
// app.get 부분은 서버에 get요청이 있는경우, app.listen은 서버가 실행되는 경우에
// 각각 실행이 됩니다. 이렇게 어떠한 조건이 갖춰지면
// 실행되는 코드를 가지는 함수를 event listener(이벤트 리스너)라고 합니다.
app.get('/', function(req, res) { // '/' 위치에 'get'요청을 받으면,
  res.send('Hello World From SeoJW'); // 해당 문구를 보냄
});

// app.HTTP_Method_중_하나('Route_주소', 콜백_함수, 콜백_함수, ...) 구조
// 콜백 함수에는 req, res, next의 parameter들(이 순서만 중요할 뿐 이름은 바꿔도 상관없습니다)이
// 자동으로 전달

// req
// request에 관련된 값들과 함수들이 저장되어 있는 object.
// HTTP request header, 요청 url, cookies, query, body 등의 정보가 저장되어 있습니다.

// 이 object의 전체 구조를 확인하고 싶을땐 콜백 함수에
// console.log(req) 코드를 넣으면 안을 확인할 수 있습니다.
// (req 뿐만 아니라 나머지 res, next 등도 console.log를 통해 값을 확인해 봅시다!)

// res
// response에 관련된 값들과 함수들이 저장되어 있는
// object. HTTP response header, cookies, HTTP code 등의 정보를 확인하고 값을 변경할 수도 있습니다.

// 또한 어떠한 방식으로 response할지도 정할 수 있습니다.
// 위 예제에서는 res.send를 사용해서 텍스트를 response하였습니다.

// next
// 만약 여러개의 콜백 함수를 사용한다면 이 함수를 호출하여 다음번 콜백 함수로 넘어갈 수 있습니다.
// 위 예제에서는 함수가 하나뿐이므로 parameter에 적지 않았습니다.

var port = 3000; // 사용할 포트 번호를 변수로 지정
app.listen(port, function(){ // port 변수로 3000번 포트에 node.js 서버를 연결
  console.log('server connected. http://localhost:' + port); // 서버 실행시 콘솔창 로그
});
