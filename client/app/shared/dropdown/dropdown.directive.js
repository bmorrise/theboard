define([
  'angular'
], function (angular) {

  dropdown.$inject = ['$document'];

  function dropdown($document) {
    return {
      retrict: 'AE',
      scope: {},
      link: function (scope, element, attr) {
        var menu = element.next();
        var menuWidth = menu[0].clientWidth;
        menu.css('display', 'none');
        menu.css('left', -(menuWidth) + element[0].clientWidth + 'px');

        element.on('click', function(e) {
          menu.css('display', 'block');
          e.stopPropagation();
        });

        $document.on('click', function() {
          menu.css('display', 'none');
        });
      }
    }
  }

  return {
    name: "dropdown",
    options: ['$document', dropdown]
  }
});
