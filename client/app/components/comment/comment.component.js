define([
  'text!./comment.html',
  '../../service/data.service',
  'css!./comment.css',
], function(template, dataService) {
  'use strict';

  var options = {
    bindings: {
      comment: '=',
      column: '<',
      data: '<'
    },
    controllerAs: "vm",
    template: template,
    controller: commentController
  };

  commentController.$inject = [dataService.name];

  function commentController(dt) {
    var vm = this;
    vm.removeComment = removeComment;
    vm.updateComment = updateComment;
    vm.pendingComment = pendingComment;
    vm.addVote = addVote;
    vm.isPending = isPending;
    vm.isEdit = isEdit;

    function addVote() {
      vm.comment.votes++;
      updateComment();
    }

    function updateComment() {
      vm.comment.edit = false;
      vm.comment.status = 'complete';
      dt.updateComment(vm.data._id, vm.column._id, vm.comment);
    }

    function pendingComment() {
      vm.comment.edit = true;
      dt.pendingComment(vm.data._id, vm.column._id, vm.comment._id);
    }

    function removeComment() {
      if (confirm("Are you sure you want to delete this comment?")) {
        dt.deleteComment(vm.data._id, vm.column._id, vm.comment._id);
      }
    }

    function isPending(comment) {
      return !comment.edit && comment.status == 'pending';
    }

    function isEdit(comment) {
      return comment.edit || comment.status != 'pending';
    }
  }

  return {
    name: "comment",
    options: options
  };

});
