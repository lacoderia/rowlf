(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('projectService', ['$http', 'AUTH_API_URL_BASE', function ($http, AUTH_API_URL_BASE) {

        var _projects = [];

        function callProjects() {
            var serviceURL = AUTH_API_URL_BASE + '/projects/by_user';
            return $http.get(serviceURL, {})
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {

                        if(data.projects){
                            _projects = [];

                            for(var i=0; i < data.projects.length; i++){
                                _projects.push(data.projects[i]);
                            }
                        }

                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        }

        function getProjects() {
            return _projects;
        }

        var service = {
            callProjects: callProjects,
            getProjects: getProjects
        };

        return service;
    }]);

})(window.angular);
