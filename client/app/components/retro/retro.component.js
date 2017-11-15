define([
  'text!./retro.html',
  '../../service/data.service',
  'socketio',
  'css!./retro.css',
], function(template, dataService, io) {

  'use strict';

  var options = {
    bindings: {},
    controllerAs: "vm",
    template: template,
    controller: retroController
  };

  retroController.$inject = [dataService.name, "$location", "$stateParams", "$scope"];

  function retroController(dt, $location, $stateParams, $scope) {
    var vm = this;
    vm.addColumn = addColumn;

    var id = $stateParams.id;
    var socket = io.connect();
    var addedColumns = [];

    if (id) {
      dt.getRetrospective(id).then(function(res) {
        console.log(res.data);
        vm.data = res.data;
      });
    }

    socket.on('update', function (data) {
      if (vm.data._id == data.retroId) {
        if (data.action == "add") {
          if (data.column) {
            vm.data.columns.push(data.column);
            if (addedColumns.indexOf(data.column._id) != -1) {
              data.column.edit = true;
            }
          }
        }
        if (data.action == "update") {
          if (data.column) {
            var column = getColumn(data.column._id);
            column.name = data.column.name;
            column.pending = false;
          }
        }
        if (data.action == "delete") {
          if (data.column) {
            var column = getColumn(data.column._id);
            var index = vm.data.columns.indexOf(column);
            vm.data.columns.splice(index, 1);
          }
        }
        if (data.action == "pending") {
          if (!data.commentId) {
            var column = getColumn(data.columnId);
            column.pending = true;
          }
        }
        $scope.$apply();
      }
    });

    function getColumn(columnId) {
      for (var i = 0; i < vm.data.columns.length; i++) {
        var column = vm.data.columns[i];
        if (column._id == columnId) {
          return column;
        }
      }
      return null;
    }

    /** Manipulate Columns **/
    function addColumn() {
      dt.addColumn(vm.data._id, {name: "New Column"}).then(function(res) {
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
