var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public')); // 1

/*
app.use()는 app.use(콜백_함수)의 형태로 사용되며 app.get과 마찬가지로
req, res, next의 parameter가 콜백 함수로 자동으로 전달됩니다.
하지만 app.get과 다르게 HTTP method나 route에 상관없이
서버에 요청이 올 때마다 무조건 콜백함수가 실행됩니다.

콜백 함수가 온다고 했는데, 실제로 온 것은 express.static(__dirname + '/public')로
함수를 호출하고 있는데요, 이 함수를 호출하면 실제 사용될 콜백 함수가 return됩니다.

__dirname은 node.js에서 프로그램이 실행중인 파일의 위치를 나타내는
global variable입니다.

위 내용을 종합해서 설명하면,
app.use(express.static(__dirname + '/public'))는
'현재_위치/public' route를 static폴더로 지정하라는 명령어가 됩니다.
즉 '/'에 접속하면 '현재_위치/public'를,
'/css'에 접속하면 '현재_위치/public/css'를 연결해 줍니다.
*/

// public 폴더의 index.html을 살펴봅시다.

var port = 3000;
app.listen(port, function(){
  console.log('server StaticFolder on! http://localhost:'+port);
});
