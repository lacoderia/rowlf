(function(angular) {
    'use strict';

    function builderController($mdPanel, $scope, collectionGrids, collectionTilesService) {

        var ctrl = this;
        /*
        var _selectedTiles = [
            { id: 7, name: 'uno 3x3', url: 'http://198.61.202.55:8081/system/tiles/images/000/000/007/original/Amalia_12x12.svg?1469489170', xml: '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 20.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 565.2 565.8" style="enable-background:new 0 0 565.2 565.8;" xml:space="preserve"><style type="text/css">	.st0{fill:none;stroke:#000000;stroke-miterlimit:10;}	.st1{fill:none;stroke:#000000;stroke-width:0.75;}</style><path class="st0" d="M0,0v565.8h565.2V0H0z M447.4,394v54.4l0,0.3H393c0,0,0.7,112.1-109.9,109.2h-0.3	c-111.2,2.9-110.5-109.2-110.5-109.2h-54.8l0.3-0.3V394c0,0-112.1,0.7-109.2-109.9v-0.3C5.7,173.3,117.8,173.9,117.8,173.9v-54.4	l0.7,0h54.4c0,0-0.7-112.1,109.9-109.2h0.3C393.6,7.4,393,119.5,393,119.5h54.4l0,0v54.4c0,0,112.1-0.7,109.2,109.9v0.3	C559.5,394.7,447.4,394,447.4,394z"/><path class="st1" d="M117.8,119.5v54.4c0,0-112.1-0.7-109.2,109.9v0.3C5.7,394.7,117.8,394,117.8,394v54.4l-0.3,0.3h54.8	c0,0-0.7,112.1,110.5,109.2h0.3C393.6,560.9,393,448.8,393,448.8h54.4l0-0.3V394c0,0,112.1,0.7,109.2-109.9v-0.3	c2.9-110.5-109.2-109.9-109.2-109.9v-54.4l0,0H393c0,0,0.7-112.1-109.9-109.2h-0.3C172.2,7.4,172.9,119.5,172.9,119.5h-54.4"/><path class="st0" d="M520,280.7c2.9-85.3-114.5-71.4-114.5-71.4v-50.5l-0.7,1.3h-50.5c0,0,13.9-117.4-71.4-114.5h-0.3	c-86.7-2.9-72.5,114.5-72.5,114.5h-51.3l0.7,0.7v49.6c0,0-117.4-13.7-114.5,70.2v0.3c-2.9,85.3,114.5,71.4,114.5,71.4v50.5l-0.7,0	h51.3c0,0-14.2,117.4,72.5,114.5h0.3c85.3,2.9,71.4-114.5,71.4-114.5h50.5l0.7,0v-50.5c0,0,117.4,13.9,114.5-71.4V280.7z M323,305.1	c0,0,41.2,68.3,26.6,92.4c0,0-35.2-10.2-66.1-66.7l-0.1-0.7c-30.9,56-66.1,66.1-66.1,66.1c-14.6-23.9,26.6-91.6,26.6-91.6	c-46.2,8.8-91.6-17.5-96.7-20.6c-0.8,0.4-1.2,0.7-1.2,0.7l0.7-1c0,0,0.2,0.1,0.5,0.3c7.6-4.5,51.4-28.7,96-20.2	c0,0-41.2-67.7-26.6-91.6c0,0,35.2,10.1,66.1,66.1l0.1-1.3c30.9-56,66.1-66.1,66.1-66.1c14.6,23.9-26.6,91.6-26.6,91.6	c49.1-9.3,97.2,20.9,97.2,20.9l0.7,0.7C420.2,284,372.1,314.4,323,305.1z"/><path class="st0" d="M283.5,330.8c30.9,56.5,66.1,66.7,66.1,66.7c14.6-24.1-26.6-92.4-26.6-92.4c49.1,9.4,97.2-21.1,97.2-21.1	l-0.7-0.7c0,0-48.1-30.2-97.2-20.9c0,0,41.2-67.7,26.6-91.6c0,0-35.2,10.1-66.1,66.1l-0.1,1.3c-30.9-56-66.1-66.1-66.1-66.1	c-14.6,23.9,26.6,91.6,26.6,91.6c-49.1-9.3-97.2,20.9-97.2,20.9l0.7-1c0,0,48.1,30.2,97.2,20.9c0,0-41.2,67.7-26.6,91.6	c0,0,35.2-10.1,66.1-66.1"/></svg>' }
        ];
        */
        var _selectedTiles = [];
        var _tmpTile;
        var _gridTypes;
        var _grid = [];
        var _selectedGridType;
        var _tableStyle;
        var _mdPanel = undefined;

        var _colors = [
            { name: 'white', hex: 'white'},
            { name: 'red', hex: 'red'},
            { name: 'blue', hex: 'blue'},
            { name: 'green', hex: 'green'},
            { name: 'orange', hex: 'orange'}
        ];
        ctrl.selectedColor = 0;

        ctrl.setColor = function(indexColor){
            ctrl.selectedColor = indexColor;
        };

        ctrl.getColors = function(){
            return _colors;
        };

        ctrl.getColorStyle = function(color){
            return {
                'background-color': color.hex
            }
        };

        $scope.$on('selectedTilesChange', function(){
            ctrl.refreshSelectedTiles();
        });

        ctrl.refreshSelectedTiles = function() {
            _selectedTiles = collectionTilesService.getSelectedTiles();
        };

        ctrl.getSelectedTiles = function () {
            return _selectedTiles;
        };

        ctrl.getSelectedGridType = function () {
            return _selectedGridType;
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.getTableStyle = function () {

            return _tableStyle = {
                'padding-top': (100/_selectedGridType.cols)+'%',
                'width': (100/_selectedGridType.cols)+'%'
            };
        };

        /**
         *
         */
        ctrl.getTmpTile = function() {
            return _tmpTile;
        };

        /**
         *
         * @param tile
         */
        ctrl.customizeTile = function(tile) {
            _tmpTile = angular.copy(tile);
            ctrl.showDialog();
        };

        /**
         *
         */
        ctrl.showDialog = function() {
            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: builderController,
                disableParentScroll: true,
                templateUrl: 'components/builder/panel.template.html',
                hasBackdrop: true,
                panelClass: 'tile-customizer',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: true,
                escapeToClose: true,
                focusOnOpen: true,
                scope: $scope,
                preserveScope: true
            };
            _mdPanel = $mdPanel.create(config);
            _mdPanel.open();
        };

        ctrl.closeDialog = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                _tmpTile = undefined;
            });
        };

        ctrl.saveChanges = function() {

            for(var i=0; i<_selectedTiles.length; i++){
                if(_selectedTiles[i].tmpId == _tmpTile.tmpId){
                    _selectedTiles[i] = angular.copy(_tmpTile);
                }
            }

            ctrl.closeDialog();
        };

        ctrl.$onInit = function() {
            _gridTypes = collectionGrids.getCollectionGrids();

            var maxCols = 0;
            var maxRows = 0;

            for(var gridIndex=0; gridIndex<_gridTypes.length; gridIndex++){
                var gridType = _gridTypes[gridIndex];
                maxCols = (maxCols <= gridType.cols)? gridType.cols : maxCols;
                maxRows = (maxRows <= gridType.rows)? gridType.rows : maxRows;
                if(gridType.default){
                    _selectedGridType = gridType;
                }
            }

            for(var rowIndex=0; rowIndex<maxRows; rowIndex++){
                _grid[rowIndex] = [];
                for(var colIndex=0; colIndex<maxCols; colIndex++){
                    _grid[rowIndex][colIndex] = {
                        active: (rowIndex <= (_selectedGridType.rows-1) && colIndex <= (_selectedGridType.cols-1)),
                        tile: {}
                    };
                }
            }
        };

    }

    angular
        .module('builder')
        .component('builder', {
            templateUrl: 'components/builder/builder.template.html',
            controller: builderController,
            bindings: {

            }
        });

})(window.angular);