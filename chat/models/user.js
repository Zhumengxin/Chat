var  client = require('../database');
function  User(user) {
    this.name = user.name;
    this.password = user.password;
    this.phone = user.phone;
    this.realname = user.realname;
    this.email = user.email;
    this.State = user.State;
}

var tableName = "UserAccount";
mysql = client.getDbCon();
module.exports = User;
//新增用户


User.prototype.save = function  save(callback) {
    // 用户对象
    var  user = {
        name: this.name,
        password: this.password,
        realname: this.realname,
        phone: this.phone,
        email: this.email,
        State: this.State
    };
    //uuid = uid.v4();
    //插入数据库
    var sql ="insert into UserAccount (AccountName,Password,Name,Phone,Email,State) values(?,?,?,?,?,?)";

    mysql.query(sql,[user.name,user.password,user.realname,user.phone,user.email,user.State],function(err,results,fields){
        if (err) {
            throw err;
        } else {
            return callback(err);
        }
    });
};


User.getUserByName = function getUserByName(AccountName, callback) {

    // 读取 users 集合
    var sql = "select * from UserAccount where AccountName='"+AccountName+"'";
    //console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            //console.log(results[0]);
            callback(err,results[0],fields);
        }
    })

};

User.getUserByEmail = function getUserByEmail(Email, callback) {

    // 读取 users 集合
    var sql = "select * from UserAccount where Email='"+Email+"'";
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            //console.log(results[0]);
            callback(err,results[0],fields);
        }
    })

};

User.getUserByID = function getUserByID(ID, callback) {

    // 读取 users 集合
    var sql = "select * from UserAccount where IdNo='"+ID+"'";
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            //console.log(results[0]);
            callback(err,results[0],fields);
        }
    })

};

User.getInfo = function getInfo(accountID, callback) {

    // 读取 users 集合
    var sql = "select * from UserAccount where AccountID='"+accountID+"'";
    //console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            //console.log(results[0]);
            callback(err,results[0],fields);
        }
    })

};

User.setInfo = function setInfo(accountID, user, callback) {
    var sql = "update UserAccount set Phone="+user.phone+",Password='"+user.loginpasswd+"',PayPassword='"+user.paypasswd+"' where AccountID='"+accountID+"'";
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        callback(err,results);
    })

};

User.delMessage = function delMessage(accountID) {
    var sql = "delete from UserMessage where AccountID='"+accountID+"'";
    mysql.query(sql,function(err,results,fileds){
        
    })
};

User.delAccount = function delAccount(accountID) {

    var sql = "delete from UserAccount where AccountID='"+accountID+"'";

    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            console.log(results);
            //callback(err,results[0],fields);
        }
    })

};

User.AddGroup = function addgroup(accountID,GroupName) {
    var sql ="insert into GroupList (MasterID,GroupName) values(?,?)";
    mysql.query(sql,[accountID,GroupName],function(err,results,fields){
        if (err) {
            //throw err;
        } else {
            return;// callback(err);
        }
    });
};

User.GetGroup = function getgroup(accountID,callback){
    var sql = "select * from GroupList where MasterID="+accountID;
    var group = [];
    mysql.query(sql,function(err,results,fields){
        if (err) {
            //throw err;
            console.log("getgroup error");
        } else {
            result = [];
           // var i ;
            //console.log("hahha"+results);
            for (var i in results){
                //console.log("hahaha"+results[i].MasterID);
                result[i] = results[i].GroupID;
            }
            callback(result);
        }
    })
};

User.FindFriend = function findfriend(friendname,callback){
    var sql =  "select * from UserAccount where AccountName like '%"+friendname+"%'";
    mysql.query(sql,function(err,results,fields){
        if(err){
            
        }
       // console.log(sql);
        result = [];
        for(var i in results){
            result[i] = results[i].AccountName;  
            //console.log(results[i]);
        }
        //console.info(result);
        callback(err,result);
    });
};

User.AddFriend = function addfriend(accountid,friendname,myname,callback){
    var sql= "select * from UserAccount where AccountName ='"+friendname+"'";
    console.log(sql);
    var friendid;
    var groupid;
    mysql.query(sql,function(err,results,fields){
        if(err)
            throw err;
        friendid = results[0].AccountID;
        //console.log("friendid:"+friendid);
        sql = "select * from GroupList where MasterID = "+accountid+" ORDER BY GroupID";
        mysql.query(sql,function(err,results,fields){
            groupid = results[0].GroupID;
            //console.log("group:"+groupid);
            sql = "insert into FriendList values("+accountid+","+friendid+",'"+friendname+"',"+groupid+")";
            mysql.query(sql,function(err,results,fields){
                if(err){
                    console.log("addfriend fail");
                    return callback(false);
                }
                else{
                    sql = "select * from GroupList where MasterID = "+friendid+" ORDER BY GroupID";
                    mysql.query(sql,function(err,results,fields){
                        groupid = results[0].GroupID;
                        sql = "insert into FriendList values("+friendid+","+accountid+",'"+myname+"',"+groupid+")";
                        mysql.query(sql,function(err,results,fields){
                            if(err){
                                console.log("addfriend fail");
                                return callback(false);
                            }
                            else 
                                return callback(true); 
                        });
                    });
                }
            });
        });
    });
    
}

User.getFriendByGroup = function getFriendByGroup(groupid){
   // var sql = "select * from FriendList where GroupID ="+groupid;
    var result = [];
    mysql.query(sql,function(err,results,fields){
        for(var i in results){
            result[i] = results[i].SlaveID;
        }
    });
    //console.info(result);
    return result;
};


User.GetFriend = function getfriend(accountid,callback){
    var friendlist = new Map();    //the format is "groupid":[{'id':1,'name':'zmx'},{...},{...}]
    var group = [];
    var groupidarray= []; // it stores the group id
    var groupname = new Map();   //the format is {groupid:groupname};
    var groupid;
    var groupid_string;
    var sql = "select * from GroupList where MasterID="+accountid;
    mysql.query(sql,function(err,results,fields){
        for(var i in results){
            
            groupid = results[i].GroupID;
            groupidarray.push(groupid);
            groupid_string = groupid.toString();
            groupname.set(groupid_string,results[i].GroupName);
        }
        sql = "select * from FriendList where MasterID ="+accountid+ " ORDER BY GroupID";
        mysql.query(sql,function(err,results,fields){
            groupid = 0;
            for(var i in results){
                if(results[i].GroupID == groupid){
                    //console.log("1");
                    group.push({'id':results[i].SlaveID,'name':results[i].FriendName});
                    
                }
                else{
                    if(group.length != 0){
                       // console.log("2");
                        //console.log(groupid);
                        friendlist.set(groupid_string,group);
                        groupid_string = groupid.toString();
                        group = [];
                        groupid = results[i].GroupID;
                        group.push({'id':results[i].SlaveID,'name':results[i].FriendName});

                    }
                    else{
                       // console.log("3");
                        groupid = results[i].GroupID;
                        groupid_string = groupid.toString();
                        console.log(groupid);
                        group.push({'id':results[i].SlaveID,'name':results[i].FriendName});
                    }
                }

            }
            friendlist.set(groupid_string,group);
            //
            //console.log(friendlist);
            
            callback(groupidarray,groupname,friendlist);
        });
    });
   
}

User.CheckFriend = function CheckFriend(accountid,friendname,callback){
    var sql = "select  * from UserAccount where AccountName ='"+friendname+"'";
    var friendid;
    //console.log(sql);
    mysql.query(sql, function(err,results,fields){
        if(err)
            //console.log(err);
            throw err;
        else
            friendid = results[0].AccountID;
        if(friendid == accountid)
            return callback(false);
        sql = "select * from FriendList where MasterID = "+accountid+" and SlaveID = "+friendid;
        mysql.query(sql,function(err,results,fields){
            if(err)
                console.log(err);
            else if(results.length == 0)
                return callback(true);
            else
                return callback(false);
    });

    });
    
    
};

User.getTotalMessage = function getTotalMessage(accountID, callback) {
    var sql = "select * from UserMessage where AccountID='"+accountID+"'";
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        console.log(results);
        callback(err,results);
    })
};

User.getClickedMessage = function getClickedMessage(accountID, backUrl, callback) {
    var sql = "select * from UserMessage where AccountID='" + accountID + "'" + " and IsClick = false";
    console.log(sql);
    mysql.query(sql,function(err, results, fields){
        var messages = new Array();
        for(var i in results){
            var date = new Date();
            var date1 = new Date(results[i].MessageTime);
            var time = "";
            var time_diff = 0;
            if(time_diff = (parseInt(date.getFullYear())- parseInt(date1.getFullYear()))){
                time = time_diff + "年之前"
            }
            else if(time_diff = (parseInt(date.getMonth())- parseInt(date1.getMonth()))){
                time = time_diff + "月之前"
            }
            else if(time_diff = (parseInt(date.getDate())- parseInt(date1.getDate()))){
                time = time_diff + "天之前"
            }
            else if(time_diff = (parseInt(date.getHours())- parseInt(date1.getHours()))){
                time = time_diff + "小时之前"
            }
            else if(time_diff = (parseInt(date.getMinutes())- parseInt(date1.getMinutes()))){
                time = time_diff + "分钟之前"
            }
            else if(time_diff = (parseInt(date.getSeconds())- parseInt(date1.getSeconds()))){
                time = time_diff + "秒之前"
            }
            var message = {
                message : results[i].MessageContent,
                time : time,
                href : "/account"+ backUrl +"/message/" + results[i].MessageID + "/click",
                sender : results[i].MessageSender
            }
            messages.push(message);
        }
        callback(err, messages);
    });
};

User.clickMessage = function clickMessage(accountID, messageID) {
    var sql = "update UserMessage set isClick = true where AccountID='"+accountID+"' and MessageID='"+messageID+"'";
    mysql.query(sql,function(err,results,fields){
        console.log(err);
    });
};

User.clickAllMessage = function clickAllMessage(accountID) {
    var sql = "update UserMessage set isClick = true where AccountID='"+accountID+"'";
    mysql.query(sql,function(err,results,fields){
        console.log(err);
    });
};

User.insertMessage = function insertMessage(data, callback) {
    var sql = "Insert into UserMessage values(NULL, " + data.accountID + ", "+ data.sender + ", '" + data.message + "', NULL, default)";
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        console.log(results);
        callback(err);
    })
};



User.getUserByPID = function getUserByPID(PID, callback) {

    // 读取 users 集合
    var sql = "select Name from UserAccount where AccountName='"+PID+"'";
    console.log('test--------------');
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
            console.log(results[0].Name);
            callback(err,results[0].Name,fields);
        }
    })
};

User.deletePID = function deletePID(Num, PID, Accountid ,callback) {

    // 读取 users 集合
    var sql = "update UserAccount set " + Num + "= NULL where AccountID='"+Accountid+"' and " + Num + "='" + PID + "'";
    var sql1 = "delete from PaymentAccount where PaymentNo='"+PID+"'";
    console.log('test--------------');
    console.log(sql);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
                mysql.query(sql1,function(err,results1,fields){
                    console.log(results);
                    callback(err);
                })
        }
    })
};

User.addPID = function addPID(PIDPassword ,PID, Num, Accountid, callback) {

    // 读取 users 集合
    var sql = "Insert into PaymentAccount values('" + PID + "', 'ICBC',  '6288888888888888' ,'Normal')";
    var sql1 = "update UserAccount set " + Num + "='" + PID + "' , "  + Num + "Password" + "='" + PIDPassword +  "' where AccountID='"+Accountid+"'";
    console.log('test--------------');
    console.log(sql);
    console.log(sql1);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
                mysql.query(sql1,function(err,results1,fields){
                    console.log(results);
                    callback(err);
                })
        }
    })
};

User.tranSubmit = function tranSubmit(transfer_num, user_id, Accountid, callback) {

    // 读取 users 集合
    var sql = "select Balance from UserAccount where Accountid='" + Accountid + "'"
    var sql2 = "update UserAccount set Balance = Balance + " + transfer_num + " where Name='"+user_id+"'";
    console.log('test--------------');
    console.log(sql2);
    mysql.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }else{
                var new_balance = parseFloat(results[0].Balance) - parseFloat(transfer_num);
                var sql1 = "update UserAccount set Balance ='" + new_balance + "'where AccountID='"+Accountid+"'";
                mysql.query(sql1,function(err,results1,fields){
                    mysql.query(sql2,function(err,results2,fields){
                        console.log(results2);
                        // var trans_balance = parseFloat(results2[0].Balance) + parseFloat(transfer_num);
                        // var sql3 = "update UserAccount set Balance ='" + trans_balance + "'where Name='"+user_id+"'";
                        console.log(results);
                        callback(err);
                    })
                })
        }
    })
};