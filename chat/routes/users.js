var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	// if(!req.session.user){
	// 	console.log('No logining!');
	// 	return res.redirect('/'); 
	// }
	var nowID = req.query.accountid;
	console.log(nowID);
  res.render("chat",{AccountID:nowID});


  //res.send('respond with a resource');
});

module.exports = router;
