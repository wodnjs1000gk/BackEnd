// my-module.js
﻿
var myModule = {
  name: "Kim",﻿
  age: 23,
  aboutMe: function(){
    console.log("Hi, my name is " + this.name + " and I'm " +
    this.age + " year's old.");
  }
};

module.exports = myModule;
/*
my-module.js에서 myModule 오브젝트를 만든 후
module.exports에 넣어줍니다.
*/
