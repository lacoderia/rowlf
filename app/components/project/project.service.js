(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('projectService', ['$http', '$q', 'AUTH_API_URL_BASE', function ($http, $q, AUTH_API_URL_BASE) {

        var _projects = [];

        function callProjects() {
            var serviceURL = AUTH_API_URL_BASE + '/projects/by_user';
            return $http.get(serviceURL, {})
                .then(function(response) {
                    var data = angular.copy(response.data);
                    if (typeof data === 'object') {
                        if(data.projects){
                            _projects = [];

                            for(var i=0; i < data.projects.length; i++){
                                var project = {
                                    id: data.projects[i].id,
                                    url: data.projects[i].url,
                                    name: data.projects[i].name,
                                    description: data.projects[i].description ? data.projects[i].description : '',
                                    tiles: data.projects[i].tiles,
                                    filename: data.projects[i].filename,
                                    createdAt: data.projects.length - i,
                                    createdAtFormat: moment(data.projects[i].created_at).format('L, HH:mm '),
                                };
                                _projects.push(project);
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

        function saveProject(project, filename, url) {
            var serviceURL = AUTH_API_URL_BASE + '/projects/save';
            return $http.post(serviceURL, { 
                    name: project.name, 
                    description: project.reference,
                    tile_ids: project.tileIds,
                    filename: filename, 
                    url: url,  
                })
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
