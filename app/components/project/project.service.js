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
                                var tempProject = data.projects[i];
                                tempProject.createdAt = '25/07/2021 12:13'
                                _projects.push(tempProject);
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

        function sendProject(projectId, email) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/send_by_email';
            return $http.post(serviceURL, {
                email: email,
                project_id: projectId
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
        }

        function deleteProjectById(projectsArray, projectId) {
            for(var projectIndex = projectsArray.length-1; projectIndex >= 0; projectIndex--) {
                var project = projectsArray[projectIndex];
                if(project.id == projectId) {
                    projectsArray.splice(projectIndex, 1);
                    break;
                }
            }
        }

        function deleteProject(projectId) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/' + projectId;
            return $http.delete(serviceURL, {})
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
        }

        function deleteFile(project) {
            var serviceURL = '/api/project';

            return $http.post(serviceURL, { filename: project.filename })
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

        function saveProject(name, filename, url) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/save';
            return $http.post(serviceURL, { name: name, filename: filename, url: url })
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
            sendProject: sendProject,
            deleteProject: deleteProject,
            deleteFile: deleteFile,
            deleteProjectById: deleteProjectById
        };

        return service;
    }]);

})(window.angular);
