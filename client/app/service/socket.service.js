define(['socketio'], function(socketio) {
  'use strict';

  var factoryArray = ['$q', factory];
  var module = {
    name: "socketService",
    factory: factoryArray
  };

  return module;

  function factory($q) {
    var io = socketio.connect();

    return {
      join: join,
      addColumn: addColumn,
      updateColumn: updateColumn,
      deleteColumn: deleteColumn,
      pendingColumn: pendingColumn,
      addComment: addComment,
      updateComment: updateComment,
      deleteComment: deleteComment,
      pendingComment: pendingComment
    };

    function join(room) {
      io.emit('room', room);
    }

    function addColumn(callback) {
      _on('column.add', callback);
    }

    function updateColumn(callback) {
      _on('column.update', callback);
    }

    function deleteColumn(callback) {
      _on('column.delete', callback);
    }

    function pendingColumn(callback) {
      _on('column.pending', callback);
    }

    function addComment(callback) {
      _on('comment.add', callback);
    }

    function updateComment(callback) {
      _on('comment.update', callback);
    }

    function deleteComment(callback) {
      _on('comment.delete', callback);
    }

    function pendingComment(callback) {
      _on('comment.pending', callback);
    }

    function _on(event, callback) {
      io.on(event, function(data) {
        callback(data);
      });
    }

//     function asyncGreet(name) {
//   var deferred = $q.defer();
//
//   setTimeout(function() {
//     deferred.notify('About to greet ' + name + '.');
//
//     if (okToGreet(name)) {
//       deferred.resolve('Hello, ' + name + '!');
//     } else {
//       deferred.reject('Greeting ' + name + ' is not allowed.');
//     }
//   }, 1000);
//
//   return deferred.promise;
// }
  }
})
