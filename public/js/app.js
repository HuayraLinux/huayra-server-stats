'use strict';

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  "leaflet-directive",
  'btford.socket-io',
  'tc.chartjs',
  'app.bar'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/mapas', {
      templateUrl: 'partials/mapas',
      controller: 'MapasCtrl'
    }).
    when('/estadisticas', {
      templateUrl: 'partials/estadisticas',
      controller: 'EstadisticasCtrl'
    }).
    otherwise({
      redirectTo: '/mapas'
    });
});
