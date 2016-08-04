(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('builderService', ['$http', 'AUTH_API_URL_BASE', function ($http, AUTH_API_URL_BASE) {

        var _colors = [];
        var _grid = [];

        function callColors() {
            var serviceURL = AUTH_API_URL_BASE + '/colors';
            return $http.get(serviceURL, {}).then(
                function (response) {
                    try {
                        if (response.data) {
                            for (var colorIndex = 0; colorIndex<response.data.colors.length; colorIndex++){
                                var color = response.data.colors[colorIndex];
                                if(color.active){
                                    _colors.push({
                                        id: color.id,
                                        name: color.name,
                                        hex_value: color.hex_value
                                    });
                                }
                            }
                        }
                    }catch (error){
                        console.log(error)
                    }
                });
        }

        function getColors() {
            return _colors;
        }

        function setGrid(grid) {
            _grid = grid;
        }

        function getGrid() {
            return _grid;
        }

        var service = {
            callColors: callColors,
            getColors: getColors,
            setGrid: setGrid,
            getGrid: getGrid
        };

        return service;
    }]);

})(window.angular);
