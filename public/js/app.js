'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  "leaflet-directive",

  // 3rd party dependencies
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/mapas', {
      templateUrl: 'partials/mapas',
      controller: 'MapasCtrl'
    }).
    when('/estadisticas', {
      templateUrl: 'partials/estadisticas',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/mapas'
    });

  $locationProvider.html5Mode(true);
});
