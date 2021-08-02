// models/Counter.js

/*
Counter는 '{name:'posts',count:0}'라는 데이터 단 하나만을
가질 예정이며, 새 게시물이 생성될 때마다 게시물은 이 값을
읽어와서 1을 더한 후 그 값을 게시물번호로 사용하고,
'posts' counter의 count값을 1 증가시키게 됩니다.

우리는 현재 'posts'만 사용하지만, 만약 다른 collection의
번호를 저장하고자 한다면 counters collection을 사용하면 
되겠습니다.
*/

var mongoose = require('mongoose');

// schema
var counterSchema = mongoose.Schema({
  name:{type:String, required:true},
  count:{type:Number, default:0},
});

// model & export
var Counter = mongoose.model('counter', counterSchema);
module.exports = Counter;
