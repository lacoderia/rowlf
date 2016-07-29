(function(angular, sessionService) {
    'use strict';

    angular.module('login').factory('loginService', ['$http', '$q', 'sessionService', 'AUTH_API_URL_BASE', function ($http, $q, sessionService, AUTH_API_URL_BASE) {

        var login = function(user){
            var loginServiceURL = AUTH_API_URL_BASE + '/users/sign_in';
            return $http.post(loginServiceURL, { user: user })
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {

                        if(data.user){

                            var headers = {
                                'accessToken' : response.headers('access-token'),
                                'expiry': response.headers('expiry'),
                                'tokenType': response.headers('token-type'),
                                'uid': response.headers('uid'),
                                'client': response.headers('client')
                            };

                            sessionService.setHttpHeaders(headers);

                        }

                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var signUp = function(user, internal){
            var registerServiceURL = AUTH_API_URL_BASE + '/users/sign_up';
            return $http.post(registerServiceURL, { user: user, internal: internal })
                .then(function(response) {
                    console.log(response);
                    var data = response.data;
                    if (typeof data === 'object') {
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var recoverPassword = function(forgot){
            var forgotServiceURL = AUTH_API_URL_BASE + '/users/password';
            return $http.post(forgotServiceURL, {
                utf8: 'V',
                user: forgot
            })
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var resetPassword = function(reset){
            var resetServiceURL = AUTH_API_URL_BASE + '/auth/password';
            return $http.put(resetServiceURL, {
                utf8: 'V',
                user: reset
            })
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {
                        if(data.user){
                            var user = data.user;
                            sessionService.createSession(user);
                        }
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var getCurrentSession = function(){
            var sessionServiceURL = AUTH_API_URL_BASE + '/session';
            return $http.get(sessionServiceURL, {})
                .then(function(response){
                    var data = response.data;
                    if (typeof data === 'object') {

                        if(data.user){
                            var headers = {
                                'accessToken' : response.headers('access-token'),
                                'expiry': response.headers('expiry'),
                                'tokenType': response.headers('token-type'),
                                'uid': response.headers('uid'),
                                'client': response.headers('client')
                            };

                            sessionService.setHttpHeaders(headers);

                            var user = data.user;
                            sessionService.createSession(user);
                        }

                        return data;
                    } else {
                        return $q.reject(data);
                    }
                },
                function(error){
                    return $q.reject(error.data);
                });
        };

        var service = {
            login: login,
            signUp: signUp,
            recoverPassword: recoverPassword,
            resetPassword: resetPassword,
            getCurrentSession: getCurrentSession
        };

        return service;

    }]);
})(window.angular);
