define([
  'text!./retro.html',
  '../../service/data.service',
  '../../service/socket.service',
  'socketio',
  'css!./retro.css',
], function(template, dataService, socketService) {

  'use strict';

  var options = {
    bindings: {},
    controllerAs: "vm",
    template: template,
    controller: retroController
  };

  retroController.$inject = [dataService.name, socketService.name, "$location", "$stateParams", "$scope"];

  function retroController(dt, socketService, $location, $stateParams, $scope) {
    var vm = this;
    vm.addColumn = addColumn;
    vm.author = "anonymous";

    var addedColumns = [];
    if ($stateParams.id) {
      dt.getRetrospective($stateParams.id).then(function(res) {
        vm.retrospective = res.data;
        socketService.join(vm.retrospective._id);
      });
    }

    socketService.addColumn(function(data) {
      vm.retrospective.columns.push(data.column);
      if (addedColumns.indexOf(data.column._id) != -1) {
        data.column.edit = true;
      }
      $scope.$apply();
    });
    socketService.updateColumn(function(data) {
      var column = getColumn(data.column._id);
      column.name = data.column.name;
      column.status = "complete";
      $scope.$apply();
    });
    socketService.deleteColumn(function(data) {
      var column = getColumn(data.column._id);
      var index = vm.retrospective.columns.indexOf(column);
      vm.retrospective.columns.splice(index, 1);
      $scope.$apply();
    });
    socketService.pendingColumn(function(data) {
      var column = getColumn(data.columnId);
      column.status = "pending";
      $scope.$apply();
    });

    function getColumn(columnId) {
      for (var i = 0; i < vm.retrospective.columns.length; i++) {
        var column = vm.retrospective.columns[i];
        if (column._id == columnId) {
          return column;
        }
      }
      return null;
    }

    /** Manipulate Columns **/
    function addColumn() {
      dt.addColumn(vm.retrospective._id, {name: "New Column", status: "pending"}).then(function(res) {
        var column = getColumn(res.data._id);
        if (column) {
          column.edit = true;
        } else {
          addedColumns.push(res.data._id);
        }
      });
    }
  }

  return {
    name: "retro",
    options: options
  };

});
