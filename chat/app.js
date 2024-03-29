var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var search = require('./routes/search')
var chat = require("./routes/chat");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'zmx',
  name: 'cookiespace',
  coolie: {maxAge: 600000},
  resave: true,
  saveUnitialized: true
}));

app.use('/', routes);
app.use('/users', users);
app.use('/register',register);
app.use('/searchfriend',search);
app.use('/chat',chat);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//socket code
var users = { };

io.on('connection', function(socket){
  console.log('a user connected');

   socket.on('new user',function(data){
     if(data in users){
         
     }else{
        var accountid = data;
        users[accountid]= socket;
        console.log("new "+accountid+" "+ typeof(accountid));
     }
     //console.log(data);
  });



  socket.on('private message',function(from, to, msg){
    console.log('I received a private message by ', from, ' say to ',to, msg);
    
    if(to in users){
      console.log(to);
        users[to].emit('to:'+to,{message:msg,from:from});
    }
    else
      console.log("offline");
  });
  
 
});




io.on('disconnection',function(socket){
  console.log('a user leaved');
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
