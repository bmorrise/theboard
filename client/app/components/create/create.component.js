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

  createController.$inject = [dataService.name, "$location"];

  function createController(dt, $location) {
    var vm = this;
    vm.createRetrospective = createRetrospective;
    vm.keyUp = keyUp;

    function keyUp(event, name) {
      if (event.keyCode == 13) {
        createRetrospective(name);
      }
    }

    function createRetrospective(name) {
      dt.createRetrospective(
        {
          name: name,
          columns: [
            { name: "What went well" },
            { name: "What can be improved" },
            { name: "Action items" }
          ]
        }
      ).then(function(res) {
        $location.path('/retro/' + res.data.slug);
        vm.data = res.data;
      });
    }
  }

  return {
    name: "create",
    options: options
  };

});
