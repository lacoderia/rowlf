(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('routingService', [function () {

        var _view = undefined;

        var getView = function() {
            return _view;
        };

        var setView = function(view){
            _view = view;
        };

        var getParam = function(param) {
            var vars = {};

            window.location.href.replace(
                /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
                function( m, key, value ) { // callback
                    vars[key] = value !== undefined ? value : '';
                }
            );

            if ( param ) {
                return vars[param] ? vars[param] : null;
            }
            return vars;
        };

        var service = {
            getView: getView,
            setView: setView,
            getParam: getParam
        };

        return service;
    }]);

})(window.angular);