'use strict';

angular
    .module('World', ['Server', 'ngRoute', 'ngAnimate', 'ngSanitize'])
    .config(['$routeProvider', $routeProvider => {
        $routeProvider
            .when('/', {
                templateUrl: 'js/world/world.html',
                controller: 'WorldCtrl'
            });
    }])
    .controller('WorldCtrl', ['$scope', '$rootScope',
        '$location', 'server', '$timeout',
        function ($scope, $rootScope, $location, server, $timeout) {

            $("#viewport")
              .css("opacity",'0')
              .animate({
                  opacity: 1
              }, 1000);

            // WTF?
            server.on('gesturedetected', function (e) {
                if ($rootScope.onGestureDetected) {
                    $rootScope.onGestureDetected(e);
                }
            });

            // If person comes up to 2.8m start presenting
            // If person goes out to more then 3.5m return back to world view
            $scope.$watch('distanceZ', function (newval) {
                if (newval <= 2.8) {
                    $timeout(function () {
                        $location.path('/view/1'); // WTF? Why 1, probably should be nearest...
                    });
                }
                if ((newval >= 3.5)) {
                    $timeout(function () {
                        $location.path('/');
                    });
                }
            });

            $rootScope.$watch('projects', v => $scope.projects = v);
            $rootScope.$watch('distanceX', v => $scope.distanceX = v);

            $(window).mousemove(event => {
                $scope.distanceX = event.pageX / 5000;
                $scope.$digest();
            });

            $("#body")
              .css("opacity", '1')
              .animate({
                  opacity: 0
              }, 1200, function () {
                  $("#body").removeClass('go-go');
              });

        }]);
