var createError = require('http-errors');
var express = require('express');
var http = require('http').Server(express);
var socket = require('socket.io')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameRouter = require('./routes/play_game');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/playGame',gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




var server = app.listen(3000,function(){
    console.log("Server is running...");
});



//TODO: Complete real time part....
clients = {}

var io = socket(server);

io.on('connection', function(socket){
    
    socket.on("add-user",function(data){
        clients[data.userName] = {
            socket: socket.id;
        }
        console.log(clients);
    })
});



module.exports = app;
