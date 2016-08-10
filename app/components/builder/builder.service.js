(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('builderService', ['$http', 'AUTH_API_URL_BASE', function ($http, AUTH_API_URL_BASE) {

        var _colors = [];

        function callColors() {
            var serviceURL = AUTH_API_URL_BASE + '/colors';
            return $http.get(serviceURL, {}).then(
                function (response) {
                    try {
                        if (response.data) {
                            _colors = [];
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

        var service = {
            callColors: callColors,
            getColors: getColors
        };

        return service;
    }]);

})(window.angular);
