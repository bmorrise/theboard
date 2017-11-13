define([
  'text!./column.html',
  '../../service/data.service',
  'socketio',
  'css!./column.css',
], function(template, dataService, io) {

  'use strict';

  var options = {
    bindings: {
      column: '=',
      data: '<'
    },
    controllerAs: "vm",
    template: template,
    controller: columnController
  };

  columnController.$inject = [dataService.name, '$scope'];

  function columnController(dt, $scope) {
    var vm = this;
    vm.updateColumn = updateColumn;
    vm.removeColumn = removeColumn;
    vm.addComment = addComment;
    vm.pendingColumn = pendingColumn;
    var addedComments = [];
    var socket = io.connect();

    socket.on('update', function (data) {
      if (vm.data._id == data.retroId) {
        if (data.action == "add") {
          if (data.comment && data.columnId == vm.column._id) {
            vm.column.comments.push(data.comment);
            if (addedComments.indexOf(data.comment._id) != -1) {
              data.comment.edit = true;
            }
          }
        }
        if (data.action == "update") {
          if (data.comment && data.columnId == vm.column._id) {
            var comment = getComment(data.comment._id);
            comment.message = data.comment.message;
            comment.votes = data.comment.votes;
            comment.status = 'complete';
          }
        }
        if (data.action == "delete") {
          if (data.comment && data.columnId == vm.column._id) {
            var comment = getComment(data.comment._id);
            var index = vm.column.comments.indexOf(comment);
            vm.column.comments.splice(index, 1);
          }
        }
        if (data.action == "pending") {
          if (data.columnId == vm.column._id && data.commentId) {
            var comment = getComment(data.commentId);
            comment.status = 'pending';
          }
        }
        $scope.$apply();
      }
    });

    function updateColumn() {
      vm.column.edit = false;
      dt.updateColumn(vm.data._id, vm.column);
    }

    function pendingColumn() {
      vm.column.edit = true;
      dt.pendingColumn(vm.data._id, vm.column._id);
    }

    function removeColumn() {
      if (confirm("Are you sure you want to remove this column?")) {
        dt.deleteColumn(vm.data._id, vm.column._id);
      }
    }

    function addComment() {
      dt.addComment(vm.data._id, vm.column._id, {message:"New Comment", votes:0, status:'pending'}).then(function(res) {
        var comment = getComment(res.data._id);
        if (comment) {
          comment.edit = true;
        } else {
          addedComments.push(res.data._id);
        }
      });
    }

    function getComment(commentId) {
      for (var i = 0; i < vm.column.comments.length; i++) {
        var comment = vm.column.comments[i];
        if (comment._id == commentId) {
          return comment;
        }
      }
      return null;
    }
  }

  return {
    name: "column",
    options: options
  };

});
