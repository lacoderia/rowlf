'use strict';

angular.uppercase=function(text){
    return text.toUpperCase();
}
angular.lowercase=function(text){
    return text.toLowerCase();
}

// Declare app level module which depends on views, and components
angular.module('tileDesignStudio', [
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
    'tileCanvas',
    'tileButton',
    'builder',
    'tileGrid',
    'summaryComponent',
    'previewer'
]);

angular.module('tileDesignStudio')
    .constant('AUTH_API_URL_BASE', 'https://backend.originalmissiontile.com')
    .constant('API_URL_BASE', 'https://backend.originalmissiontile.com')
    .constant('TILES_ACTIONS', [
        { code: 'CHANGE_COLOR_TILE', icon: 'color_lens', title: 'Change color'},
        { code: 'ROTATE_TILE', icon: 'rotate_right', title: 'Rotate tile'},
        { code: 'DELETE_TILE', icon: 'delete', title: 'Delete tile'}
    ]);

angular.module('tileDesignStudio')
    .run(['$rootScope', '$route', 'routingService', function($rootScope, $route, routingService) {
        $rootScope.$on('$routeChangeSuccess', function() {
            routingService.setView($route.current.view);
        });

        if(routingService.getParam('original') == 'true') {
            $rootScope.iframe = false;
        } else {
            if(routingService.getParam('embed') == 'true'){
                $rootScope.iframe = true;
            } else {
                if ( window.location !== window.parent.location ) {
                    $rootScope.iframe = true;
                } else {
                    $rootScope.iframe = false;
                }
            }
        }

    }]);
