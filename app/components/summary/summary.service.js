(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('summaryService', ['$rootScope', '$http', 'AUTH_API_URL_BASE', function ($rootScope, $http, AUTH_API_URL_BASE) {

        var _project = [];
        var _grid = [];

        function saveProject() {
            _project = _project;
        }

        function setGrid(grid) {
            _grid = grid;
            $rootScope.$broadcast('gridChange');
        }

        function getGrid() {
            return _grid;
        }

        var service = {
            saveProject: saveProject,
            setGrid: setGrid,
            getGrid: getGrid
        };

        return service;
    }]);

})(window.angular);
