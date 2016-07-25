(function(angular) {
    'use strict';

    function tileCustomizerController($http) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;
        var _selectedTiles = [];
        var _selectedTile = undefined;
        var _canvas = undefined;
        var _source = new Image();

        /**
         *
         * @returns {Array}
         */
        ctrl.getSelectedTiles = function() {
            return _selectedTiles;
        };

        /**
         *
         * @returns {undefined}
         */
        ctrl.getSelectedTile = function() {
          return _selectedTile;
        };

        /**
         *
         * @param tile
         */
        ctrl.selectTile = function(tile) {
            _selectedTile = tile;

        };

        var paintTile = function() {
            if(_canvas && _selectedTile) {
                $http.get(_selectedTile.url).then(
                    function (response) {
                        _canvas.innerHTML = response.data;
                    },
                    function(error) {
                        console.log(error);
                    });
            }
        };

        /**
         *
         * @param canvas
         */
        ctrl.canvasInit = function(idCanvas) {
            _canvas = angular.element(document.querySelector(idCanvas))[0];
            paintTile();
        };


    }

    angular
        .module('tileCustomizer')
        .component('tileCustomizer', {
            templateUrl: 'components/tile-customizer/tile-customizer.template.html',
            controller: tileCustomizerController,
            bindings: {

            }
        });

})(window.angular);