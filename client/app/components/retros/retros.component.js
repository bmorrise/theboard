define([
  'text!./retros.html',
  '../../service/data.service',
  'socketio',
  'css!./retros.css',
], function(template, dataService, io) {

  'use strict';

  var options = {
    bindings: {},
    controllerAs: "vm",
    template: template,
    controller: retrosController
  };

  retrosController.$inject = [dataService.name, "$location", "$stateParams", "$scope"];

  function retrosController(dt, $location, $stateParams, $scope) {
    var vm = this;
    vm.deleteRetrospective = deleteRetrospective;
    dt.getRetrospectives().then(function(res) {
      vm.retros = res.data;
    });

    function deleteRetrospective(retro) {
      if (confirm("Are you sure you want to delete this retrospective?")) {
        var index = vm.retros.indexOf(retro);
        vm.retros.splice(index, 1);
        dt.deleteRetrospective(retro._id).then(function(res) {
          console.log("Deleted");
        });
      }
    }
  }

  return {
    name: "retros",
    options: options
  };

});
