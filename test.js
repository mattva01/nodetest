var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

sanitize = require('validator').sanitize
app.listen(80);
var users =[];
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
});
}

io.sockets.on('connection', function (socket) {

   socket.on('newuser', function (username)	{
     socket.username = sanitize(username).entityEncode();
     users.push(username);
     socket.emit("adminmessage","CONNECTED")
     socket.broadcast.emit("adminmessage",socket.username+" CONNECTED");
 });

   socket.on('disconnect', function(){
      socket.broadcast.emit('adminmessage', socket.username + ' has disconnected');

  });

   socket.on('sendchat', function (data) {
      sanitized_string = sanitize(data).entityEncode() 
      io.sockets.emit('clientmessage', socket.username, sanitized_string);
  });

});

