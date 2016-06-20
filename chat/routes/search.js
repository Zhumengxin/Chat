var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
	if(!req.session.user){
	 	console.log('No logining!');
	 	return res.redirect('/'); 
	 }
	var nowID = req.session.user;
	res.render("search",{AccountID:nowID,result:[]});
  	
});


router.post('/', function(req, res, next) {
	
	var nowID = req.session.user;
	var friendname = req.body.username;

	//console.log("here");
	User.FindFriend(friendname,function(err,results){
		
		//console.info("hi"+results);
		res.render("search",{AccountID:nowID,result:results});
	});
});

router.post('/add',function(req,res,next){
	var nowID = req.session.user;
	var myname = req.session.name;
	var friendname = req.body.friendname;
	//console.log(friendname);
	var flag,flag1;
	User.CheckFriend(nowID,friendname,function(flag){
		if(flag == true){
			//console.log("checjfriend ok");
			User.AddFriend(nowID,friendname,myname,function(flag1){
					if(flag1 == true)
						res.json({result:true});
					else
						res.json({result:false});
			});
			
		}
		else{
			res.json({result:false});
		}
	});
});


module.exports = router;