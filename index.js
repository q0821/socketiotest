var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var g1Histroy = [];
var g2Histroy = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  // 一開始進來先加入 group1 
  socket.join('group1');
  // 更新g1 的資料
  // todo ： 單獨推給進來這個人就好，不要整個 group 都推
  io.in('group1').emit('g1 history', g1Histroy);

  // user 觸發 g1 plus event
  socket.on('g1 plus', function(msg){
    console.log(msg);
    g1Histroy.push(msg);
    io.in('group1').emit('g1 plus', msg);
  });

  // g2 plus button event
  socket.on('g2 plus', function(msg){
    console.log(msg);
    g2Histroy.push(msg);
    io.in('group2').emit('g2 plus', msg);
  });

  socket.on('joingroup1', function (data) {
    console.log('joingroup1');
    socket.leave('group2');
    socket.join('group1');
    io.in('group1').emit('g1 history', g1Histroy);
  });

  socket.on('joingroup2',function(data){
    console.log('joingroup2');
    socket.leave('group1');
    socket.join('group2');
    io.in('group2').emit('g2 history', g2Histroy);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});