(function(angular) {
    'use strict';

    function navigationController($rootScope, $location, navigationService, sessionService, routingService) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;

        /**
         *
         * @returns {*}
         */
        ctrl.isAuthenticated = function() {
            return sessionService.isAuthenticated();
        };

        /**
         * Opens user's projects
         */
        ctrl.openProjectsView = function(){
            $rootScope.$broadcast('openProjectsView');
        };

        /**
         * Open youtube's tutorial
         */
        ctrl.openTutorial = function(){
            $rootScope.url = 'https://www.youtube.com/watch?v=5FfUYDVN1QM';
        };

        /**
         * Closes user's session
         */
        ctrl.logout = function() {
            navigationService.logout()
                .then(function(data) {
                    $location.path('/login');
                }, function(error) {
                    if(error && error.errors){
                        console.log(error.errors[0].title);
                    }
                });
        };

        ctrl.getView = function() {
            return routingService.getView();
        };

        ctrl.goTo = function(path) {
            $location.path(path);
        };
    }

    angular
        .module('navigation')
        .component('navigation', {
            templateUrl: 'components/navigation/navigation.template.html',
            controller: navigationController,
            bindings: {

            }
        });

})(window.angular);
