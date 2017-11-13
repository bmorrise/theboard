define([
  'angular'
], function (angular) {

  edit.$inject = ['$compile', '$timeout'];

  function edit($compile, $timeout) {
    return {
      retrict: 'AE',
      scope: {
        onComplete: '&',
        onEdit: '&',
        value: '=',
        auto: '<',
        type: '<'
      },
      link: function (scope, element, attr) {
        function getTemplate(type) {
          var template = '<span ng-click="edit()" ng-bind="value"></span>';
          switch (type) {
            case 'textarea':
              return template += '<textarea ng-model="value"></textarea>';
              break;
            default:
              return template += '<input ng-model="value"></input>';
              break;
          }
          return template;
        }
        element.html(getTemplate(scope.type));
        $compile(element.contents())(scope);
        element.parent().addClass('editable');
        var inputElement = element.children()[1];
        var timer;
        scope.edit = function() {
          element.addClass('editing');
          $timeout(function() {
            inputElement.focus();
            inputElement.select();
            scope.onEdit();
          }, 0);
          start();
        }

        scope.$onChanges = function(changes) {
          if (changes.auto.currentValue && isEditing() == false) {
            scope.edit();
          }
        }

        angular.element(inputElement).on('keydown', function(e) {
          if (e.keyCode == 13) {
            finish();
          }
          reset();
        });

        angular.element(inputElement).on('blur', function() {
          finish();
        });

        function reset() {
          stop();
          start();
        }

        function start() {
          timer = $timeout(function() {
            finish();
          }, 30000);
        }

        function stop() {
          $timeout.cancel(timer);
        }

        function isEditing() {
          return element.hasClass('editing');
        }

        function finish() {
          $timeout.cancel(timer);
          if (isEditing()) {
            element.removeClass('editing');
            scope.onComplete();
          }
        }

        if (scope.auto == true) {
          scope.edit();
        }
      }
    }
  }

  return {
    name: "edit",
    options: ['$compile', '$timeout', edit]
  }
});
