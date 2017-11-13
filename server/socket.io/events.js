'use strict';

module.exports = function(io) {
  io.on('connection', function (socket) {
    socket.on('addComment', function (data) {
      console.log(data);
      socket.emit('receiveComment', data);
    });
  });
};
