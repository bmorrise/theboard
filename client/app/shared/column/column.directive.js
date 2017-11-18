define([
  'angular'
], function (angular) {

  column.$inject = ['$document', '$timeout', '$window'];

  function column($document, $timeout, $window) {
    return {
      // retrict: 'AE',
      // scope: {},
      link: function (scope, element, attr) {
        $timeout(resize, false);
        function resize() {
          element.css('height', '');
          if (element[0].offsetHeight > $window.innerHeight - 213) {
            element.css('height', ($window.innerHeight - 212) + "px");
          }
          console.log(element[0].scrollHeight);
          $(element).scrollTop(element[0].scrollHeight);
          //$id.scrollTop($id[0].scrollHeight);
        }
        angular.element($window).bind('resize', resize);
      }
    }
  }

  return {
    name: "scrunch",
    options: ['$document', '$timeout', '$window', column]
  }
});
