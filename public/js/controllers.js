'use strict';

/* Controllers */

var app = angular.module("demoapp", ["leaflet-directive", "myApp.directives"]);

var controllers = angular.module('myApp.controllers', []);



controllers.factory('SessionService', function($http) {
  var current_user = null;

  return {
    autenticar: function(nombre, password, exito_callback, error_callback) {

      $http({
        url: 'http://localhost:3000/api/login',
        method: "POST",
        data: {
                'nombre': nombre,
                'passwd_md5': password,
              }
      })
      .then(function(response) {

        if (response.data.token) {
          current_user = nombre;
          exito_callback();
        } else {
          current_user = null;
          error_callback();
        }
      },
        function(reason) {
          current_user = null;
          error_callback();
        }
      );

    },

    autentificado: function() {
      return !!current_user;
    },

    logout: function() {
      current_user = null;
    }
  };
});


controllers.controller("LoginCtrl", function($scope, $location, SessionService) {
  $scope.error = "";
  $scope.nombre = "";
  $scope.password = "";

  $scope.login = function () {

    SessionService.autenticar($scope.nombre, $scope.password, function() {
        $location.path('mapas');
      }, function() {
        $scope.error = "El nombre de usuario o contraseña son inválidos.";
        $location.path('login');
        $scope.password = "";
      }
    );
  }
});

controllers.controller('LogoutCtrl', function(SessionService, $location) {
  SessionService.logout();
  $location.path('login');
});

controllers.controller('MapasCtrl', function ($scope, $http, SessionService, $location) {
  var puntos_del_mapa = {};
  $scope.cargando = "Cargando ...";

  if (!SessionService.autentificado())
    $location.path('login');


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


  $http.get('api/puntos').then(function(res) {
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

  /*
  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
  */
});


controllers.controller('EstadisticasCtrl', function ($scope, $http, SessionService, $location) {
    $scope.eventos = [];
    $scope.equipos_sin_reportarse = 0;
    $scope.equipos_conectados_en_total = 0;
    $scope.equipos_conectados_este_mes = 0;

    if (!SessionService.autentificado())
      $location.path('login');


    $scope.options = {width: 500, height: 300};

    $scope.hovered = function(d){
      $scope.barValue = d;
      $scope.$apply();
    };

    $scope.barValue = 0;

    $http.get('api/eventos').then(function(res) {
      var registros = res.data;
      $scope.eventos = registros;
    });


    $http.get('api/desconectados').then(function(res) {
      $scope.equipos_sin_reportarse = res.data.cantidad;
    });

    $http.get('api/conectados_este_mes').then(function(res) {
      $scope.equipos_conectados_este_mes = res.data.cantidad;
    });

    $http.get('api/conectados_en_total').then(function(res) {
      $scope.equipos_conectados_en_total = res.data.cantidad;
    });

    $scope.datos = {
      labels : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets : [
      {
        fillColor : 'rgba(151,187,205,0.5)',
        strokeColor : 'rgba(151,187,205,1)',
        data : []
      }
      ]
    };

    $http.get('api/conectados_por_mes').then(function(res) {
      $scope.datos.datasets[0].data = res.data.valores;
    });

  });
