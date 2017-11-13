define([
  'angular',
  './app/components/retro/retro.component',
  './app/app.config',
  './app/components/create/create.component',
  './app/components/column/column.component',
  './app/components/comment/comment.component',
  './app/components/retros/retros.component',
  './app/service/data.service',
  './app/shared/edit/edit.directive',
  './app/shared/focus/focus.directive',
  './app/shared/dropdown/dropdown.directive',
  './app/shared/draggable/draggable.directive',
  'uirouter'
], function(angular, retroComponent, appConfig, createComponent, columnComponent, commentComponent, retrosComponent, dataService, editDirective, focusDirective, dropdownDirective, draggableDirective) {
  'use strict';

  var module = {
    name: "app",
    bootstrap: bootstrap
  };

  activate();

  return module;

  function activate() {
    angular.module(module.name, ['ui.router'])
      .component(retroComponent.name, retroComponent.options)
      .component(createComponent.name, createComponent.options)
      .component(columnComponent.name, columnComponent.options)
      .component(commentComponent.name, commentComponent.options)
      .component(retrosComponent.name, retrosComponent.options)
      .service(dataService.name, dataService.factory)
      .directive(editDirective.name, editDirective.options)
      .directive(focusDirective.name, focusDirective.options)
      .directive(dropdownDirective.name, dropdownDirective.options)
      .directive(draggableDirective.name, draggableDirective.options)
      .config(appConfig);
  }

  function bootstrap(element) {
    angular.element(element).ready(function() {
      angular.bootstrap(element, [module.name], {
        strictDi: true
      })
    });
  }
});
