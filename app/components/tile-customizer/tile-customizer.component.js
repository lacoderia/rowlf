(function(angular) {
    'use strict';

    function tileCustomizerController($http, collectionTilesService) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;
        var _selectedTiles = [
            { id: 7, name: "uno 3x3", url: "/assets/images/collection-tiles/Amalia 12x12.svg" },
            { id: 8, name: "uno 3x3", url: "/assets/images/collection-tiles/Amalia 12x12.svg" },
            { id: 9, name: "uno 3x3", url: "/assets/images/collection-tiles/Amalia 12x12.svg" },
            { id: 10, name: "uno 3x3", url: "/assets/images/collection-tiles/Amalia 12x12.svg" }
        ];
        var _selectedTile = undefined;
        var _canvas = undefined;
        var _source = new Image();

        /**
         *
         * @returns {Array}
         */
        ctrl.getSelectedTiles = function() {
            //_selectedTiles = collectionTilesService.getSelectedTiles();
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