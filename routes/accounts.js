var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Profile = require('../models/profile');


router.get('/:id',isLoggedIn, function(req, res, next) {
  Profile.find(function(err, profile) {
    var info = [];
    for (var i = 0; i < profile.length; i++) {
      for (var r=0; r< profile[i].friends.length;r++) {
        if ((profile[i].friends[r].equals(req.user._id)) || profile[i].mode===true){
          info.push(profile[i]);
        }
      }
    }
    res.render('profile/profile', {  profiles: info });
  });
});

router.get('/:id/scheduler', isLoggedIn, function(req, res){
  res.render('scheduler');
});

router.get('/:id/add', isLoggedIn, function(req, res){
  res.render('profile/profile_add');
});

router.post('/:id/add', isLoggedIn, function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.render('profile/profile_add',{
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
  }});



  router.get('/edit/:id', isLoggedIn,function(req, res) {
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      return  res.status(404).send("page not found");

      if(!(profile.user.equals(req.user._id))){
        return res.status(500).send('You are not the owner.No authorisation');
        res.render("/profile");
      }
      res.render('profile/profile_edit', {profiles :profile});

    });
  });

  // Update Submit POST Route
  router.post('/edit/:id', function(req, res){
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      {
        res.status(404).send('Sorry, page not found');
      }
      else {
        var new_title = (req.body.title === "") ? profile.title : req.body.title;
        var new_description = (req.body.description === "") ? profile.description : req.body.description;
        var new_mode = (req.body.mode === "true") ? true: false;

        let new_profile= {};
        new_profile.title = new_title;
        new_profile.description =  new_description ;
        new_profile.mode = new_mode;

        let query = {_id:req.params.id}

        Profile.update(query, new_profile, function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'Mindmap Updated');
            res.redirect('/');
          }

        });
      }
    });
  });

  router.get('/delete/:id', isLoggedIn,function(req, res) {
    Profile.findById(req.params.id, function(err, profile){
      if (!err)
      res.render('profile/profile_delete', {profiles: profile});
    });
  });



  router.post('/delete/:id',  isLoggedIn,function(req, res){
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      return res.status(404).send("page not found");

      if(!(profile.user.equals(req.user._id))){
        return res.status(500).send('You are not the owner.No authorisation');
      }

      else {
        Profile.findByIdAndRemove(req.params.id,function (err){
          if (err) {
            return   res.status(500).send('Unable to remove');
          }
          else {
            res.redirect('/accounts/:id');
          }
        });
      }
    });
  });


  router.post('/invitation/:id',  isLoggedIn,function(req, res){
    Profile.findById(req.params.id, function(err, profile){
      if(!(profile.user.equals(req.user._id))){
        res.status(500).send('You are not the owner!');
      }
      else {
        var added = false;
        User.findOne({'email': req.body.friend}).exec( function(err,user) {
          for (var r=0; r< profile.friends.length;r++) {
            if (profile.friends[r].equals(user.id)){
              added = true;
              break;
            }
          }

          if (added === false){
            profile.friends.push(user.id);
            profile.save();
            console.log("send invitataion");

          }
        });
      }
    });
    res.redirect('/accounts/:id');

  });




  router.get('/mindmaps/:id', isLoggedIn, function(req, res){
    var access= false;
    Profile.findById(req.params.id, function(err, profile){
      if (err)
      res.status(404).send("page not found");
      else {
        for (var i =0; i<profile.friends.length ;i++) {
          if ((profile.friends[i].equals(req.user._id)) || profile.mode===true){
            access =true;
            break;
          }
        }
      }
      if (access===false)
      res.status(500).send('No authorisation');

      else {
        res.render('mindmap', {
          layout: 'mindmap-layout'
        });
      }
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
