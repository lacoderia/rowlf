(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('projectService', ['$http', '$q', 'AUTH_API_URL_BASE', function ($http, $q, AUTH_API_URL_BASE) {

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

        function deleteProjectById(projectsArray, projectId) {
            for(var projectIndex=projectsArray.length-1; projectIndex>0; projectIndex--) {
                var project = projectsArray[projectIndex];
                if(project.id == projectId) {
                    projectsArray.splice(projectIndex, 1);
                }
            }
        }

        function deleteProject(projectId) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/' + projectId;
            return $http.delete(serviceURL, {})
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {
                        console.log(data);
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        }

        function deleteFile(project) {
            var serviceURL = '/api/project';

            return $http.post(serviceURL, { fileName: project.name })
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {
                        deleteProjectById(_projects, project.id);
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        }

        function saveProject(name, url) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/save';
            return $http.post(serviceURL, { name: name, url: url })
                .then(function(response) {
                    var data = response.data;
                    if (typeof data === 'object') {
                        _projects.push(data);
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        }

        var service = {
            callProjects: callProjects,
            getProjects: getProjects,
            saveProject: saveProject,
            deleteProject: deleteProject,
            deleteFile: deleteFile,
            deleteProjectById: deleteProjectById
        };

        return service;
    }]);

})(window.angular);
