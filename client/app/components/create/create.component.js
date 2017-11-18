define([
  'text!./create.html',
  '../../service/data.service',
  'css!./create.css',
], function(template, dataService) {

  'use strict';

  var options = {
    bindings: {},
    controllerAs: "vm",
    template: template,
    controller: createController
  };

  createController.$inject = [dataService.name, "$state"];

  function createController(dt, $state) {
    var vm = this;
    vm.$onInit = onInit;
    vm.createRetrospective = createRetrospective;
    vm.keyUp = keyUp;
    vm.team = "none";
    function onInit() {
      dt.getTeams().then(function(res) {
        vm.teams = res.data;
      });
    }

    function keyUp(event, name) {
      if (event.keyCode == 13) {
        createRetrospective(name);
      }
    }

    function createRetrospective(team, name) {
      dt.createRetrospective({team:team, name: name}).then(function(res) {
        var retrospective = res.data;
        var columns = [
          { name: "What went well" },
          { name: "What can be improved" },
          { name: "Action items" }
        ];
        dt.addColumns(retrospective._id, columns).then(function(res) {
          $state.go("retro", {id: retrospective.slug});
        });
      });
    }
  }

  return {
    name: "create",
    options: options
  };

});
