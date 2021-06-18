var express = require('express');
var router = express.Router();
// express.Router()를 사용해서 router함수를 초기화합니다.

// Home
router.get('/', function(req, res){
  res.redirect('/contacts');
});
/*
app.get에서 router.get으로 바뀐 것만 빼면 이전코드와 동일합니다.
"/"에 get 요청이 오는 경우를 router함수에 설정해 줍니다.
*/
module.exports = router;
/*
module.exports에 담긴 object(여기서는 router object)가 module이 되어
require시에 사용됩니다.
*/
