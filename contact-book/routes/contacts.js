// /route/contacts

var express = require('express');
var router = express.Router();
var Contact = require('../models/Contact');
/*
contact.js에는 Contact module을 require로 호출합니다.
*/
/*
나머지는 home.js와 마찬가지로 app.HTTP_METHOD들이 router.HTTP_METHOD로 바뀌었습니다.
그리고 route 문자열에서 contacts가 빠졌는데(destroy를 예를들면 "contacts/:id"에서 
"/:id"로 바뀌었습니다), index.js에서

app.use('/contacts', require('./routes/contacts'));

로 이미 "/contacts"인 경우에만 이 module이 호출되기 때문입니다.
*/
// Index
router.get('/', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});

// New
router.get('/new', function(req, res){
  res.render('contacts/new');
});

// create
router.post('/', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

// show
router.get('/:id', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/show', {contact:contact});
  });
});

// edit
router.get('/:id/edit', function(req, res){
  Contact.findOne({_id:req.params.id}, function(err, contact){
    if(err) return res.json(err);
    res.render('contacts/edit', {contact:contact});
  });
});

// update
router.put('/:id', function(req, res){
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts/'+req.params.id);
  });
});

// destroy
router.delete('/:id', function(req, res){
  Contact.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

module.exports = router;
