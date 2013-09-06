'use strict';

/* Controllers */

var app = angular.module("demoapp", ["leaflet-directive", "myApp.directives"]);


angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, socket) {
  socket.on('send:name', function (data) {
    $scope.name = data.name;
  });
}).
controller('MapasCtrl', function ($scope, $http, socket) {
  var puntos_del_mapa = {};
  $scope.cargando = "Cargando ...";

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

    $scope.cargando = "";
    $scope.actualizar_mapa();
  });

  $scope.actualizar_mapa();

  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
}).
controller('EstadisticasCtrl', function ($scope, $http) {
    $scope.eventos = [];
    $scope.equipos_sin_reportarse = 0;
    $scope.equipos_conectados_en_total = 0;
    $scope.equipos_conectados_este_mes = 0;

    $scope.criterios = [
      {etiqueta: 'Todos', valor: 0},
      {etiqueta: 'Este mes', valor: 1},
      {etiqueta: 'Solo hoy', valor: 2},
    ];
    $scope.criterio = $scope.criterios[0];


    $scope.$watch('criterio', function (nuevo, anterior) {
      var datos = {
        0: [10, 20, 11, 40, 43],
        1: [2, 3],
        2: [3],
      }

      $scope.data = datos[nuevo.valor];
    });




    $scope.options = {width: 500, height: 300};
    $scope.data = [1, 2, 3, 4];

    $scope.hovered = function(d){
      $scope.barValue = d;
      $scope.$apply();
    };

    $scope.barValue = 0;

    $http.get('/api/eventos').then(function(res) {
      var registros = res.data;
      $scope.eventos = registros;
    })

  });
