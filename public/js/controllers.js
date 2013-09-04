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
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
