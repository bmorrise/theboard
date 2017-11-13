define([
  'angular'
], function (angular) {

  function focus() {
    return {
      retrict: 'AE',
      scope: {},
      link: function (scope, element, attr) {
        element[0].focus();
      }
    }
  }

  return {
    name: "focus",
    options: [focus]
  }
});
