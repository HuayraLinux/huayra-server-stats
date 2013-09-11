'use strict';

/* Controllers */

var app = angular.module("demoapp", ["leaflet-directive", "myApp.directives"]);

var controllers = angular.module('myApp.controllers', []);



controllers.factory('SessionService', function() {
  var current_user = undefined;

  return {
    autenticar: function(nombre, password, exito_callback, error_callback) {

      if (nombre == 'admin' && password == '123123') {
        current_user = nombre;
        exito_callback();
      }
      else {
        current_user = undefined;
        error_callback();
      }
    },

    autentificado: function() {
      return !!current_user;
    }
  };
});


controllers.controller("LoginCtrl", function($scope, $location, SessionService) {
  $scope.error = "";
  $scope.nombre = "";
  $scope.password = "";

  $scope.login = function () {

    SessionService.autenticar($scope.nombre, $scope.password, function() {
        $location.path('/mapas');
      }, function() {
        $scope.error = "El nombre de usuario o contraseña son inválidos.";
        $location.path('/login');
        $scope.password = "";
      }
    );
  }
});

controllers.controller('MapasCtrl', function ($scope, $http, socket) {
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

    for (i=0; i<registros.length; i++) {
      var punto = {
        message: registros[i].message,
        lat: registros[i].lat,
        lng: registros[i].lng
      }

      /* Solo se representan puntos que tengan posicion */
      if (punto.lng && punto.lat)
        $scope.agregar_punto(punto);
    }

    $scope.cargando = "";
    $scope.actualizar_mapa();
  });

  $scope.actualizar_mapa();

  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
});


controllers.controller('EstadisticasCtrl', function ($scope, $http) {
    $scope.eventos = [];
    $scope.equipos_sin_reportarse = 310;
    $scope.equipos_conectados_en_total = 860;
    $scope.equipos_conectados_este_mes = 550;

    $scope.criterios = [
      {etiqueta: 'Todos', valor: 0},
      {etiqueta: 'Este mes', valor: 1},
      {etiqueta: 'Solo hoy', valor: 2},
    ];
    $scope.criterio = $scope.criterios[0];


    $scope.$watch('criterio', function (nuevo, anterior) {
      var datos = {
        0: [ 28, 48, 40, 19, 96, 247, 100, 237, 100, 27, 250, 200],
        1: [ 18, 18, 10, 19, 16, 24, 20, 22, 33, 17, 25, 20],
        2: [ 8, 8, 4, 2, 6, 4, 10, 12, 10, 9, 10, 10],
      }

      $scope.datos.datasets[0].data = datos[nuevo.valor];
    });

    $scope.options = {width: 500, height: 300};

    $scope.hovered = function(d){
      $scope.barValue = d;
      $scope.$apply();
    };

    $scope.barValue = 0;

    $http.get('/api/eventos').then(function(res) {
      var registros = res.data;
      $scope.eventos = registros;
    });


    $scope.datos = {
      labels : [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets : [
      {
        fillColor : 'rgba(151,187,205,0.5)',
        strokeColor : 'rgba(151,187,205,1)',
        data : [ 28, 48, 40, 19, 96, 27, 100, 27, 100, 27, 100, 200]
      }
      ]
    };
    
  });