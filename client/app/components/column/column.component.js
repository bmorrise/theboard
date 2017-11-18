define([
  'text!./column.html',
  '../../service/data.service',
  '../../service/socket.service',
  'socketio',
  'css!./column.css',
], function(template, dataService, socketService, socketio) {

  'use strict';

  var options = {
    bindings: {
      column: '=',
      retrospective: '<'
    },
    controllerAs: "vm",
    template: template,
    controller: columnController
  };

  columnController.$inject = [dataService.name, socketService.name, '$scope', '$window'];

  function columnController(dt, socketService, $scope, $window) {
    var vm = this;
    vm.updateColumn = updateColumn;
    vm.removeColumn = removeColumn;
    vm.addComment = addComment;
    vm.pendingColumn = pendingColumn;
    vm.isPending = isPending;
    vm.isEdit = isEdit;
    vm.$onInit = onInit;
    var addedComments = [];

    function onInit() {
      socketService.join(vm.retrospective._id);
    }

    socketService.addComment(function(data) {
      if (data.columnId == vm.column._id) {
        vm.column.comments.push(data.comment);
        if (addedComments.indexOf(data.comment._id) != -1) {
          data.comment.edit = true;
        }
        $scope.$apply();
        $window.dispatchEvent(new Event("resize"));
      }
    });

    socketService.updateComment(function(data) {
      if (data.columnId == vm.column._id) {
        var comment = getComment(data.comment._id);
        comment.message = data.comment.message;
        comment.votes = data.comment.votes;
        comment.status = "complete";
        $scope.$apply();
        $window.dispatchEvent(new Event("resize"));
      }
    });

    socketService.deleteComment(function(data) {
      if (data.columnId == vm.column._id) {
        var comment = getComment(data.comment._id);
        var index = vm.column.comments.indexOf(comment);
        vm.column.comments.splice(index, 1);
        $scope.$apply();
        $window.dispatchEvent(new Event("resize"));
      }
    });

    socketService.pendingComment(function(data) {
      if (data.columnId == vm.column._id) {
        var comment = getComment(data.commentId);
        comment.status = "pending";
        $scope.$apply();
        $window.dispatchEvent(new Event("resize"));
      }
    });

    function updateColumn() {
      vm.column.edit = false;
      vm.column.status = "complete";
      dt.updateColumn(vm.retrospective._id, vm.column);
    }

    function pendingColumn() {
      vm.column.edit = true;
      dt.pendingColumn(vm.retrospective._id, vm.column._id);
    }

    function removeColumn() {
      if (confirm("Are you sure you want to remove this column?")) {
        dt.deleteColumn(vm.retrospective._id, vm.column._id);
      }
    }

    function addComment() {
      dt.addComment(vm.retrospective._id, vm.column._id, {message:"New Comment", votes:0, status:'pending'}).then(function(res) {
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

    function isPending(column) {
      return !column.edit && column.status == 'pending';
    }

    function isEdit(column) {
      return column.edit || column.status != 'pending';
    }
  }

  return {
    name: "column",
    options: options
  };

});
