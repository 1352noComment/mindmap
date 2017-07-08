var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Profile = require('../models/profile');

router.get('/profile', function(req, res, next) {
  Profile.find(function(err, profile) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < profile.length; i += chunkSize) {
      if ((profile[i].user.equals(req.user._id)) ){
        productChunks.push(profile.slice(i, i + chunkSize));
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
      friends : []

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
        if (profile.user.equals(req.user._id) || profile.mode) {
          res.render('profile/profile');
        }
        else {
          req.flash('danger', 'Not Authorized');
          res.redirect('/');
        }
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

  if(!(profile.user.equals(req.user._id))){
    res.status(500).send('Wrong');
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
        user.friends.push(req.params.id);
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
