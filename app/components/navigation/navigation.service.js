(function(angular) {
    'use strict';

    angular.module('navigation').factory('navigationService', ['$http', '$q', 'sessionService', 'AUTH_API_URL_BASE', function ($http, $q, sessionService, AUTH_API_URL_BASE) {

        var logout = function(){
            var logoutServiceURL = AUTH_API_URL_BASE + '/logout.json';
            return $http.get(logoutServiceURL)
                .then(function(response) {
                    var data = response.data;

                    sessionService.destroySession();
                    sessionService.unsetHttpHeaders();

                    return data;

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var service = {
            logout: logout
        };

        return service;

    }]);
})(window.angular);
