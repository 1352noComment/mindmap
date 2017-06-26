var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Profile = require('../models/profile');
/// Add Route

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';

router.get('/profile', function(req, res, next) {
  Profile.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('profile', {  profiles: productChunks });
  });
});

router.get('/add', ensureAuthenticated, function(req, res){
	res.render('profile_add');
});


router.post('/add', function(req, res, next) {
  var docs = new Profile( {
  title:  req.body.title,
description: req.body.description,
    accountname : req.user._id
  });

  mongo.connect(url, function(err, db) {
    db.collection('profiles').insert(docs, function(err, result) {
      console.log('Item inserted');
      db.close();
    });
  });

  res.redirect('/mindmap');
});




router.get('/:id', function(req, res) {

   Profile.findById(req.params.id, function(err, profile){
     if(profile.accountname != req.user._id){
       res.status(500).send('Sorry, you are not authorised');
     }
     else {
       Profile.findOne({ _id : req.params.id }, function(err, profile) {
         if (err || !profile) {
            res.status(404).send('Sorry, page not found')
         } else {
           res.render('frontpage');
     }
   });

    }
  });
});



router.get('/mindmap',ensureAuthenticated, function(req, res){
	res.render('mindmap', {
		layout: 'mindmap-layout'
	});
});


  function ensureAuthenticated(req, res, next){
    	if(req.isAuthenticated()){
    		return next();
    	} else {
    		req.flash('error_msg','You are not logged in');
    		res.redirect('/users/login');
    	}
    }


module.exports = router;
