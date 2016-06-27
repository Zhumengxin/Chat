var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
	 if(!req.session.user){
	 	console.log('No logining!');
	 	return res.redirect('/'); 
	 }
	//var nowID = req.query.accountid;
	var nowID = req.session.user;
	var friendid = req.query.friendid;
	res.render("chat",{AccountID:nowID,FriendID:friendid});

	
  	
});

module.exports = router;