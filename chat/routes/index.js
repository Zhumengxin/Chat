var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title : 'Express', 
                      error : ''  
                        });
});

router.route('/')

.post(function(req, res) {

    if (req.body['Loginuser'] == '' || req.body['Loginpass'] == '') {
        var err = "用户名或密码不能为空！";
        res.render('index', {error : err});
        return;
    }

    var state;
    if (req.body.user_type === "0") {
        state = 0;
    } else {
        state = 1;  
    }
    User.getUserByName(req.body.Loginuser, function (err, user) { 
        if (err) {
            throw err;
        } else {
            if (user) {
               if (req.body.Loginpass === user.Password) {
                    console.log('Login Success!');
                  
                    req.session.user = user.AccountID.toString();
                    //req.session.name = user.AccountName.toString();
                    //console.log(user.AccountID);
                    res.redirect('/users?accountid='+user.AccountID);
                    
                } else {
                    var err = "用户密码错误！";
                    res.render('index', { error : err}); 
                    return;
                }
            } else {
                User.getUserByEmail(req.body.Loginuser, function(err, user) {
                    if (err) {
                        throw err;
                    } else {
                        if (user) {
                            if (req.body.Loginpass === user.Password) {
                                console.log('Login Success!');
                                req.session.user = user.AccountID.toString();
                                    //console.log(user.AccountID);
                                res.redirect('/users');
                                
                            } else {
                                var err = "用户密码错误！";
                                res.render('index', { error : err});
                                return; 
                            }
                        } else {
                            var err = "用户不存在！";
                            res.render('index', { error : err});
                            return; 
                        }
                    }
                });
            }
        }
    });

  
});

module.exports = router;
