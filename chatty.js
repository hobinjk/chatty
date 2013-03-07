var express = require("express");
var app = express();
var server = require("http").createServer(App);
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
    sock.join(data.room);
    var roomMessages = getRoomMessages(data.room);
    sock.emit("messages", roomMessages));
  });
  sock.on("message", function(data) {
    io.sockets.in(data.room).emit("messages", [data]);
  });
});



