'use strict';

angular.module('omtApp')
    .constant('COLLECTION_GRID_ITEMS', [
        { 'id': 1, 'title': '2x2', url: 'assets/images/grid 2x2.svg' },
        { 'id': 2, 'title': '3x3', url: 'assets/images/grid 3x3.svg' },
        { 'id': 3, 'title': '3x2', url: 'assets/images/grid 3x2.svg' },
        { 'id': 4, 'title': '3x4', url: 'assets/images/grid 3x4.svg' }
    ]);

angular.
    module('omtApp').
    config(['$locationProvider', '$routeProvider', '$mdThemingProvider', 'localStorageServiceProvider',
        function config($locationProvider, $routeProvider, $mdThemingProvider, localStorageServiceProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('light-green')
                .accentPalette('blue');

            localStorageServiceProvider.setPrefix('');
            localStorageServiceProvider.setStorageCookie(45, '/');
            localStorageServiceProvider.setStorageCookieDomain('');

            var authenticate = ['$q', '$location', 'sessionService', 'loginService', function ($q, $location, sessionService, loginService) {
                var deferred = $q.defer();

                if(sessionService.isHttpHeaders()){
                    sessionService.configHttpHeaders();

                    loginService.getCurrentSession()
                        .then(function(data){

                            if(data.user){
                                deferred.resolve();
                                if($location.path() == '/login' || $location.path() == '/intro'){
                                    $location.path("/customizer");
                                }
                            }else{
                                if($location.path() == '/login'){
                                    deferred.resolve();
                                } else {
                                    deferred.reject('Not logged in');
                                    $location.path("/login");
                                }
                            }
                        }, function(response){
                            if($location.path() == '/login'){
                                deferred.resolve();
                            } else {
                                deferred.reject('Not logged in');
                                $location.path("/login");
                            }
                        });

                } else {
                    if($location.path() == '/login'){
                        deferred.resolve();
                    } else {
                        deferred.reject('Not logged in');
                        $location.path("/login");
                    }
                }

                return deferred.promise;
            }];

            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/login', {
                    template: '<login></login>',
                    resolve: authenticate,
                    view: 'login'
                }).
                when('/intro', {
                    template: '<intro></intro>',
                    resolve: authenticate,
                    view: 'login'
                }).
                when('/customizer', {
                    template: '<customizer layout-fill layout="column" flex></customizer>',
                    resolve: authenticate,
                    view: 'customizer'
                }).
                otherwise('/intro');
    }])
    .config(['collectionGridsProvider', 'COLLECTION_GRID_ITEMS', function(collectionGridsProvider, COLLECTION_GRID_ITEMS) {
        collectionGridsProvider.$get().setCollectionGrids(COLLECTION_GRID_ITEMS);
    }]);