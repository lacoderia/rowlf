(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('sessionService', ['$http', '$rootScope', 'localStorageService', function ($http, $rootScope, localStorageService) {

        var Session = undefined;

        var broadcast = function(msg, data) {
            $rootScope.$broadcast(msg, data);
        };

        var createSession = function (user) {
            Session = new User(user.id, user.first_name, user.last_name, user.email);
            broadcast('sessionCreated');
        };

        var destroySession = function() {
            Session = undefined;
        };

        var get = function(){
            return angular.copy(Session);
        };

        var isAuthenticated = function(){
            return (this.get())? true : false;
        };

        var isHttpHeaders = function(){
            return (getHttpHeaders() ? true : false);
        };

        var getHttpHeaders = function(){
            return localStorageService.cookie.get('rowlf-headers');
        };

        var configHttpHeaders = function(headers){
            if (headers === undefined) {
                headers = getHttpHeaders();
            }

            $http.defaults.headers.common['access-token'] = headers.accessToken;
            $http.defaults.headers.common['expiry'] = headers.expiry;
            $http.defaults.headers.common['token-type'] = headers.tokenType;
            $http.defaults.headers.common['uid'] = headers.uid;
            $http.defaults.headers.common['client'] = headers.client;
        };

        var setHttpHeaders = function(headers){
            localStorageService.cookie.set('rowlf-headers', headers);
            configHttpHeaders(headers);
        };

        var unsetHttpHeaders = function(){
            localStorageService.cookie.remove('rowlf-headers');

            $http.defaults.headers.common['access-token'] = undefined;
            $http.defaults.headers.common['expiry'] = undefined;
            $http.defaults.headers.common['token-type'] = undefined;
            $http.defaults.headers.common['uid'] = undefined;
            $http.defaults.headers.common['client'] = undefined;
        };

        var service = {
            destroySession: destroySession,
            createSession: createSession,
            get: get,
            isAuthenticated: isAuthenticated,
            isHttpHeaders: isHttpHeaders,
            setHttpHeaders: setHttpHeaders,
            unsetHttpHeaders: unsetHttpHeaders,
            configHttpHeaders: configHttpHeaders
        };

        return service;

    }]);
})(window.angular);
