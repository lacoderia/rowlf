(function(angular) {
    'use strict';

    function tileCustomizerController($scope, collectionTilesService, TILES_ACTIONS) {

        /**
         *↵
         * @type {Object}
         */
        var ctrl = this;
        var _selectedTiles = [];
        var _selectedTile = undefined;
        var _canvas = undefined;
        var _source = new Image();

        /**
         *
         */
        $scope.$on('selectedTilesChange', function(){
            ctrl.refreshSelectedTiles();
        });

        /**
         *
         */
        ctrl.refreshSelectedTiles = function() {
            _selectedTiles = collectionTilesService.getSelectedTiles();
        };

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
            paintTile();
        };


        /**
         *
         * @returns {*}
         */
        ctrl.getTileActions = function() {
            return TILES_ACTIONS;
        };

        /**
         *
         */
        var paintTile = function() {
            if(_canvas && _selectedTile) {
                _canvas.innerHTML = _selectedTile.xml;
            }
        };

        /**
         *
         * @param canvas
         */
        ctrl.canvasInit = function(idCanvas) {
            try{
                _canvas = angular.element(document.querySelector(idCanvas))[0];
            }catch (error){
                console.log(error);
            }
        };

        /**
         *
         */
        ctrl.completeStep = function() {
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[1].data);
        };

    }

    angular
        .module('tileCustomizer')
        .component('tileCustomizer', {
            templateUrl: 'components/tile-customizer/tile-customizer.template.html',
            controller: tileCustomizerController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);