define([
  'angular'
], function (angular) {

  function draggable() {
    return {
      retrict: 'AE',
      scope: {},
      link: function (scope, element, attr) {
        //element[0].draggable();
      }
    }
  }

  return {
    name: "draggable",
    options: [draggable]
  }
});
