var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);  // http server를 socket.io server로 upgrade

app.get('/',function(req, res){  // localhost:3001번으로 서버로 접속하면 client.html전송
  res.sendFile(__dirname + '/client.html');
});

var count=1;
io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = "user" + count++;
  io.to(socket.id).emit('change name',name);  // 로그인 사용자 에게만 메시지 전달

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
  });

  socket.on('login',function(data){
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
    // scket에 클라이언트 정보를 저장한다.
    socket.name = data.name;
    socket.userid = socket.userid;
    io.emit('login', data.name);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen(3001, function(){
  console.log('Socket IO server listening on ort 3001');
});
