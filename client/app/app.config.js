define([], function() {
  'use strict';

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider
      .state('home', {
        url: "/",
        template: "<create></create>"
      })
      .state('retro', {
        url: "/retro/:id",
        template: "<retro></retro>"
      })
      .state('retros', {
        url: "/retros",
        template: "<retros></retros>"
      });
  }
  return config;
});
