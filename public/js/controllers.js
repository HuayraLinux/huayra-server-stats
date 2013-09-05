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
  controller('MapasCtrl', function ($scope, socket) {

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

        var marcar_puntos = function(puntos) {
          angular.extend($scope, {markers: puntos });
        };

        marcar_puntos({
            a1: {
              lat: -33.128351,
              lng: -66.362915,
              message: "Una en san luis!!!"
            },

            a2: {
              lat: -33.20,
              lng: -64.094238,
              message: "por rio cuarto"
            }
        });



    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
