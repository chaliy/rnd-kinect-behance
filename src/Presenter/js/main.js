'use strict';

angular
    .module('Main', ['Server','ngRoute', 'Word', 'View'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    });
