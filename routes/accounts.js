var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Profile = require('../models/profile');
/// Add Route



router.get('/profile_add', function(req, res){
	res.render('account/profile_add');
});


router.get('/profile', function(req, res, next) {
  Profile.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
          productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render('account/profile', {  profiles: productChunks });
  });
});

module.exports = router;
