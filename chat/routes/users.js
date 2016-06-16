var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
	// if(!req.session.user){
	// 	console.log('No logining!');
	// 	return res.redirect('/'); 
	// }
	var nowID = req.query.accountid;
	console.log("here");
	User.GetGroup(nowID,function(results){
		group = []
		for(var i in results){
			group[i] = results[i];
			//console.log("GG"+group[i]);
		}
		res.render("friendlist",{AccountID:nowID,Group:group});
	});
	
  	
});

module.exports = router;