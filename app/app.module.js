'use strict';

// Declare app level module which depends on views, and components
angular.module('omtApp', [
    'ngRoute',
    'ngResource',
    'ngMessages',
    'ngMaterial',
    'md-steppers',
    'LocalStorageModule',
    'intro',
    'login',
    'navigation',
    'customizer',
    'collectionTiles',
    'collectionGrids',
    'tileCustomizer',
    'tileCanvas',
    'builder'
]);

angular.module('omtApp')
    .constant('AUTH_API_URL_BASE', 'http://198.61.202.55:8081')
    .constant('API_URL_BASE', 'http://198.61.202.55:8081')
    .constant('TILES_ACTIONS', [
        { code: 'CHANGE_COLOR_TILE', icon: 'color_lens', title: 'Change color'},
        { code: 'ROTATE_TILE', icon: 'rotate_right', title: 'Rotate tile'},
        { code: 'DELETE_TILE', icon: 'delete', title: 'Delete tile'}
    ]);

angular.module('omtApp')
    .run(['$rootScope', '$route', 'routingService', function($rootScope, $route, routingService) {
        $rootScope.$on('$routeChangeSuccess', function() {
            routingService.setView($route.current.view);
        });
    }]);