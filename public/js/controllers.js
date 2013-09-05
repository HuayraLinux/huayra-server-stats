'use strict';

/* Controllers */

var app = angular.module("demoapp", ["leaflet-directive"]);

app.controller("DemoController", [ "$scope", function($scope) {
                // Nothing here!
              }]);



angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, socket) {
  socket.on('send:name', function (data) {
    $scope.name = data.name;
  });
}).
controller('MapasCtrl', function ($scope, $http, socket) {
  var puntos_del_mapa = {};

  angular.extend($scope, {
    center: {
      lat: -38.452918,
      lng: -63.598921,
      zoom: 4
    },
    defaults: {
      tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      },
      scrollWheelZoom: false
    }
  });

  $scope.actualizar_mapa = function() {
    angular.extend($scope, {markers: puntos_del_mapa });
  }

  /*
    Ejemplo de invocacion:

          $scope.agregar_punto({
            lat: -33.128351,
            lng: -66.362915,
            message: "Una en san luis!!!"
          });
  */
  $scope.agregar_punto = function(punto) {
    var id = Math.floor((Math.random() * 1000));
    puntos_del_mapa[id] = punto;
  }


  $http.get('/api/puntos').then(function(res) {
    var registros = res.data;
    var i;

    for (i=0; i<registros.length; i++)
      $scope.agregar_punto(registros[i]);

    $scope.actualizar_mapa();
  });

  $scope.actualizar_mapa();

  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
}).
controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
