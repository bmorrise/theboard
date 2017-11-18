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

  retrosController.$inject = [dataService.name, "$state"];

  function retrosController(dt, $state) {
    var vm = this;
    vm.$onInit = onInit;
    vm.deleteRetrospective = deleteRetrospective;
    vm.addRetro = addRetro;

    function onInit() {
      dt.getRetrospectives().then(function(res) {
        vm.retros = res.data.sort(function(a, b) {
          return a.team.name.localeCompare(b.team.name);
        });
      });
    }

    function deleteRetrospective(retro) {
      if (confirm("Are you sure you want to delete this retrospective?")) {
        var index = vm.retros.indexOf(retro);
        vm.retros.splice(index, 1);
        dt.deleteRetrospective(retro._id).then(function(res) {
        });
      }
    }

    function addRetro() {
      $state.go("home");
    }
  }

  return {
    name: "retros",
    options: options
  };

});
