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
	//console.log("here");
	User.GetFriend(nowID,function(groupidarray,groupname,friendlist){
		//console.log("fuck"+results);
		//console.log("there is friendlist");
		//console.log(friendlist);
		res.render("friendlist",{AccountID:nowID,groupidarray:groupidarray,groupname:groupname,friendlist:friendlist});
	});
	
  	
});

module.exports = router;