var createError = require('http-errors');
var express = require('express');

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
  console.log("Server is running...!!!");
})

var questions = [{q:"Iranian soccer player in world cup 2017?",c1:"Sardar Azmoon",c2:"Ali Amadi",c3:"Khashaqchi",c4:"hichkodam",ans:"1"},{q:"Khashaqchi chand noghte darad?",c1:"7",c2:"8",c3:"9",c4:"10",ans:"3"},{q:"Sazandeye kelashinkof?",c1:"Ali Amadi",c2:"kelashinkof",c3:"Esna",c4:"Khasteh",ans:"2"}]

clients = []
scores = [0,0]
var io = socket(server);

io.on("connection",function(socket){
  clients.push(socket.id);
  if(clients.length==2){
    console.log("Game can be start....");
    io.sockets.emit("chat_enable");

    socket.on('chat message', function(data){
      console.log("DATA=",data);
      io.sockets.emit('chat message', data);
    });

    var qst = 0;
    var next_question = setInterval(function(){
      io.sockets.emit('next_question',questions[qst]);
      qst+=1;
      if(qst===3){
        setTimeout(function(){
          clearInterval(next_question);
          io.sockets.emit("end",{msg:"Kose Ammat"})        
        },10000)
      }
    },10000);
        
  }
  socket.on('disconnect', function(){
    io.sockets.emit('disconnect');
    console.log('user disconnected');
    clients.pop();
  });
})

module.exports = app;
