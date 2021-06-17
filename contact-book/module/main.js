// main.js

module.exports = myModule;
var m = require("./my-module");
/*
다른 파일의 module을 불러오기 위해서는 require 함수를 사용하는데,
이때 require함수에 parameter로 대상 module의 상대위치와 파일이름을
문자열로 넣습니다. js파일만 module로 불러올 수 있기 때문에 파일이름에서
.js는 생략합니다.
*/
var express = require("express");
/*
만약 module이 node_modules폴더에 있다면 위치를 생략할 수 있습니다.
npm install로 설치된 package들이 이 경우에 해당합니다.
*/

console.log(m.name);
// Kim
console.log(m.age);
// 23
﻿﻿m.aboutMe();
// Hi, my name is Kim and I'm 23 year's old.
