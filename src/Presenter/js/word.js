(function () {

    angular
        .module('Word', ['Server','ngRoute','ngAnimate', 'WordCtrl', 'ViewCtrl','ngSanitize'])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/',
                    controller: 'MainCtrl'
                })
                .when('/view/:id', {
                    templateUrl: 'templates/view_project.html',
                    controller: 'ViewCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .controller('MainCtrl', ['$routeParams','$scope', 'server', '$timeout', 'projectlikes', function ($routeParams, $scope, server, $timeout, projectlikes) {
            var viewportVar = $("#viewport");
                viewportVar.css("opacity",'0');
                viewportVar.animate({
                    opacity: 1
                }, 1000);
        }]);

})();
