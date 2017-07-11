var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
	res.render('frontpage');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

router.get('/about',  function(req, res){
	res.render('about');
});


router.get('/scheduler', ensureAuthenticated, function(req, res){
	res.render('scheduler');
});

router.get('/mindmap',ensureAuthenticated, function(req, res){
	res.render('mindmap', {
		layout: 'mindmap-layout'
	});
});

router.get('/popup', function(req, res){
	res.render('popups');
});

module.exports = router;
