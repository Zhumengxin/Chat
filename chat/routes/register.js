var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register',{title : 'Express' ,
                        error: ''
                        });
});

router.route('/')

.post(function(req, res) {
    console.log(req.body);
    if (req.body['Reguser'] == '' || req.body['Regpass'] == '') {
        var err = "用户名或密码不能为空！";
        res.render('register', {error : err});
        return;
    }

    if(req.body['Regrepass']!=req.body['Regpass']){
        var err = "两次密码不相同！";
        res.render('register', { error : err});
        return;
    }

    var emailtest = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!emailtest.test(req.body.Regemail)) {
        var err = '错误的邮箱格式！';
        res.render('register', { error : err});
        return;
    }

    var phonetest = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!phonetest.test(req.body.Regmobi)) {
        var err = '错误的手机号！';
        res.render('register', { error : err});
        return;
    }


    var  newUser =  new  User({ 
        name: req.body.Reguser, 
        password: req.body.Regpass,
        realname: req.body.Regname,
        phone: req.body.Regmobi,
        email: req.body.Regemail,
        State: 1
    }); 

    User.getUserByName(newUser.name, function (err, user) { 
        if (user) 
          err = '用户名已经存在！'; 
        if (err) { 
            res.render('register', { error : err});
            return;
        } 

        User.getUserByEmail(newUser.email, function (err, user) { 
            if (user) 
              err = '邮箱已经存在！'; 
            if (err) { 
                res.render('register', { error : err}); 
                return;
            } 
            newUser.save(function (err) { 
                if (err) { 
                    return  res.redirect('register'); 
                } 
                User.getUserByName(newUser.name, function (err, user) {
                    req.session.user = user.AccountID.toString();

                    console.log(req.session.user);
                    res.redirect('/users');
                }); 
            });

        });
    });
});

module.exports = router;
