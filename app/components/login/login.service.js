(function(angular, sessionService) {
    'use strict';

    angular.module('login').factory('loginService', ['$http', '$q', 'sessionService', 'localStorageService', 'AUTH_API_URL_BASE', function ($http, $q, sessionService, localStorageService, AUTH_API_URL_BASE) {

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

        var signUpHubspot = function(user){
            var registerHubspotServiceURL = 'https://api.hsforms.com/submissions/v3/integration/submit/4480883/420ed695-6b77-4406-bccd-267b2c121c1f';
            var hubspotObject = {
                "fields": [
                    {
                      "name": "email",
                      "value": user.email
                    },
                    {
                      "name": "firstname",
                      "value": user.name
                    },
                    {
                      "name":"phone",
                      "value": user.phone
                    },
                    {
                      "name":"address",
                      "value": user.address
                    },
                    {
                      "name":"city",
                      "value": user.city
                    },
                    {
                      "name":"state",
                      "value": user.state
                    },
                    {
                      "name":"country",
                      "value": user.country
                    },
                  ],
                  "context": {
                    "hutk": localStorageService.cookie.get('hubspotutk'),
                    "pageUri": "http://studio.originalmissiontile.com",
                    "pageName": "Design Studio",
                  },
            }
            return $http.post(registerHubspotServiceURL, hubspotObject)
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

        var getIpInfo = function () {
            var serviceURL = 'http://ipinfo.io';
            return $http.get(serviceURL, {})
                .then(function(response) {
                    if(response.data){
                        var location = response.data.city + ', ' + response.data.country
                        return location;
                    }
                    return '';
                },function(error){
                    return $q.reject(error.data);
                });


        };

        var service = {
            login: login,
            signUp: signUp,
            signUpHubspot: signUpHubspot,
            recoverPassword: recoverPassword,
            resetPassword: resetPassword,
            getCurrentSession: getCurrentSession,
            getIpInfo: getIpInfo
        };

        return service;

    }]);
})(window.angular);
