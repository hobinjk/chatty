var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

/**
 * Messages:
 * {room: String, content: String, sender: String}
 */
var messages = {};

function getRoomMessages(roomId) {
  if(messages.hasOwnProperty(roomId)) return messages[roomId];
  messages[roomId] = [];
  return messages[roomId];
}

io.sockets.on("connection", function(sock) {
  sock.on("subscribe", function(data) {
    console.log("subscribe!");
    console.log(data);
    sock.join(data.room);
    var roomMessages = getRoomMessages(data.room);
    sock.emit("messages", roomMessages);
  });
  sock.on("message", function(data) {
    console.log("message!");
    console.log(data);
    io.sockets.in(data.room).emit("messages", [data]);
    getRoomMessages(data.room).push(data);
  });
});


app.get("/", function(req, res) {
  res.sendfile("public/index.html");
});
server.listen(3000);
