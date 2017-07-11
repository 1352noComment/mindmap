
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Profile = require('../models/profile');



router.get('/profile', function(req, res, next) {
  Profile.find(function(err, profile) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < profile.length; i += chunkSize) {
      for (var r=0; r< profile[i].friends.length;r++) {
        if ((profile[i].friends[r].equals(req.user._id)) || profile[i].mode===true){
          productChunks.push(profile);
        }
      }
    }
    res.render('profile/profile', {  profiles: productChunks });
  });
});

router.get('/add', isLoggedIn, function(req, res){
  res.render('profile/profile_add');
});

router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.render('profile_add',{
      errors:errors
    });
  }

  else {
    var profile = new Profile( {
      title:  req.body.title,
      description: req.body.description,
      mode : req.body.mode,
      user: req.user,
      friends : req.user

    });
  }
  profile.save(function(err){
    if (err) {
      console.log(err);
      return;
    }
    else {
      req.flash('success', 'Successfully added document!');
      res.redirect('/mindmap');
    }
  });
});



router.get('/edit/:id', isLoggedIn,function(req, res) {
  Profile.findById(req.params.id, function(err, profile){
    if (!err)
    res.render('profile/profile_edit', {profiles :profile});
  });
});

  //get
  router.get('/:id', isLoggedIn,function(req, res) {
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      {
        res.status(404).send('Sorry, page not found');
      }
      else {
        User.findById(profile.user, function(err, user){
          for (var i = 0; i < profile.length; i += chunkSize) {
            for (var r=0; r< profile[i].friends.length;r++) {

              if (profile[i].friends[r].equals(req.user._id))
              res.render('profile/profile');
            }
          }
          req.flash('danger', 'Not Authorized');
          res.redirect('/');

        });
      }
    });
  });


  router.get('/delete/:id', isLoggedIn,function(req, res) {
    Profile.findById(req.params.id, function(err, profile){
      if (!err)
      res.render('profile/profile_delete', {profiles :profile});
    });
  });



  router.post('/delete/:id', function(req, res){
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      res.status(404).send("page not found");

      if(!(profile.user.equals(req.user._id))){
        res.status(500).send('No authorisation');
      }

      else {
        Profile.findByIdAndRemove(req.params.id,function (err){
          if (err) {
            res.status(500).send('Unable to remove');
          }
          else {
            res.redirect('/accounts/profile');
          }
        });
      }
    });
  });


  router.post('/invitation/:id', function(req, res){
    Profile.findById(req.params.id, function(err, profile){
      if(!(profile.user.equals(req.user._id))){
        res.status(500).send('Wrong');
      }
      else {
        User.findOne({'email' :req.body.friend}).exec( function(err,user) {
          if (err)
          console.log(err);
          else {
            profile.friends.push(user.id);
            profile.save();
            console.log("send invitataion");
            res.redirect('/accounts/profile');
          }
        });
      }
    });
  });


  router.get('/mindmap',isLoggedIn, function(req, res){
    res.render('mindmap', {
      layout: 'mindmap-layout'
    });
  });


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.oldUrl = req.url;
    req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }

  module.exports = router;
