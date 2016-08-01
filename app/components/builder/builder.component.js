(function(angular) {
    'use strict';

    function builderController($mdPanel, $scope, $rootScope, collectionGrids, collectionTilesService, builderService) {

        var ctrl = this;
        var _selectedTiles = [];
        var _tmpSelectedTiles = [];
        var _selectedTile;
        var _tmpTile;
        var _selectedCollectionTiles = [];
        var _gridTypes;
        var _grid = [];
        var _tableStyle;
        var _mdPanel = undefined;
        var _colors = [];
        var _colorBucketSelected = false;
        ctrl.ACTIONS = {
            'EDIT': {code: 'EDIT'},
            'COLOR_BUCKET': {code: 'COLOR_BUCKET'},
            'ROTATE': {code: 'ROTATE'},
            'DELETE': {code: 'DELETE'}
        };
        ctrl._selectedGridType =undefined;
        ctrl.selectedColor = undefined;

        ctrl.callAction = function (action) {
            switch (action){
                case ctrl.ACTIONS['EDIT'].code:
                    _colorBucketSelected = false;
                    break;
                case ctrl.ACTIONS['COLOR_BUCKET'].code:
                    _colorBucketSelected = !_colorBucketSelected;
                    break;
                case ctrl.ACTIONS['ROTATE'].code:
                    _colorBucketSelected = false;
                    rotateTile();
                    break;
                case ctrl.ACTIONS['DELETE'].code:
                    _colorBucketSelected = false;
                    break;
            }
        };

        ctrl.isColorBucketSelected = function () {
            return _colorBucketSelected;
        };

        var rotateTile = function () {
            $rootScope.$broadcast('rotateTile');
        };

        ctrl.getColors = function(){
            return _colors;
        };

        ctrl.getBucketIconStyle = function () {
            return {
                'color': ctrl.selectedColor.hex_value
            }
        };

        ctrl.getColorStyle = function(color){
            if((color.hex_value).toLowerCase() == '#ffffff'){
                return {
                    'background-color': color.hex_value,
                    'border': '1px solid #212121'
                }
            }
            return {
                'background-color': color.hex_value
            }
        };

        ctrl.setColor = function(indexColor){
            ctrl.selectedColor = indexColor;
        };

        ctrl.getSelectedColor = function () {
            return ctrl.selectedColor;
        };

        ctrl.isSelectedColor = function (color) {
            return (ctrl.selectedColor == color);
        };

        $scope.$on('selectedTilesChange', function(){
            ctrl.refreshSelectedTiles();
        });

        ctrl.refreshSelectedTiles = function() {
            _selectedTiles = collectionTilesService.getSelectedTiles();
        };

        $scope.$on('selectedCollectionTilesChange', function(){
            ctrl.refreshSelectedCollectionTiles();
        });

        ctrl.refreshSelectedCollectionTiles = function() {
            _selectedCollectionTiles = collectionTilesService.getSelectedCollectionTiles();
        };

        /**
         *
         */
        ctrl.getTmpSelectedTiles = function() {
            return _tmpSelectedTiles;
        };

        /**
         *
         * @param tile
         */
        ctrl.addTile = function(tile) {
            var tmpTile = angular.copy(tile);
            tmpTile.tmpId = collectionTilesService.getTileCount();
            _tmpSelectedTiles.push(tmpTile);
        };

        /**
         *
         */
        ctrl.openAddTile = function() {
            _tmpSelectedTiles = angular.copy(_selectedTiles);

            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: builderController,
                disableParentScroll: true,
                templateUrl: 'components/builder/add-tile.template.html',
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

        ctrl.closeAddTile = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                _tmpSelectedTiles = [];
            });
        };

        ctrl.saveAddTile = function() {
            _selectedTiles = angular.copy(_tmpSelectedTiles);
            ctrl.closeAddTile();
        };

        /**
         *
         * @returns {*}
         */
        ctrl.rotateTile = function () {
            if(_selectedTile){
                $rootScope.$broadcast('');
            }
        };

        ctrl.getSelectedTile = function () {
            return _selectedTile;
        };

        ctrl.selectTile = function (tile) {
            if(!_selectedTile){
                _selectedTile = tile;
            }else{
                _selectedTile = undefined;
            }
        };

        ctrl.isSelectedTile = function (tileId) {
            if(_selectedTile){
                return (_selectedTile.id == tileId);
            }
            return false;
        };

        ctrl.getSelectedCollectionTiles = function() {
            return _selectedCollectionTiles;
        };

        ctrl.getGridTypes = function () {
            return _gridTypes;
        };

        ctrl.getSelectedTiles = function () {
            return _selectedTiles;
        };

        ctrl.getSelectedGridType = function () {
            return ctrl._selectedGridType;
        };

        ctrl.setSelectedGridType = function (gridType) {
            ctrl._selectedGridType = gridType;
            paintCanvas();
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.getTableStyle = function () {

            return _tableStyle = {
                'padding-top': (100/ctrl._selectedGridType.cols)+'%',
                'width': (100/ctrl._selectedGridType.cols)+'%'
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
        ctrl.openCustomizer = function(tile) {
            _tmpTile = angular.copy(tile);

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

        ctrl.closeCustomizer = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                _tmpTile = undefined;
            });
        };

        ctrl.saveCustomizer = function() {

            for(var i=0; i<_selectedTiles.length; i++){
                if(_selectedTiles[i].tmpId == _tmpTile.tmpId){
                    _selectedTiles[i] = angular.copy(_tmpTile);
                }
            }

            ctrl.closeCustomizer();
        };

        var paintCanvas = function() {
            for(var rowIndex=0; rowIndex<_grid.length; rowIndex++){
                for(var colIndex=0; colIndex<_grid[rowIndex].length; colIndex++){
                    _grid[rowIndex][colIndex].active = false;
                }
            }

            for(var rowIndex=0; rowIndex<ctrl._selectedGridType.rows; rowIndex++){
                for(var colIndex=0; colIndex<ctrl._selectedGridType.cols; colIndex++){
                    _grid[rowIndex][colIndex].active = true;
                }
            }
        }

        ctrl.$onInit = function() {

            _gridTypes = collectionGrids.getCollectionGrids();
            _colors = builderService.callColors().then(
                function () {
                    _colors = builderService.getColors();
                    if(_colors.length > 0){
                        ctrl.setColor(_colors[0]);
                    }
                }
            );

            var maxCols = 0;
            var maxRows = 0;

            for(var gridIndex=0; gridIndex<_gridTypes.length; gridIndex++){
                var gridType = _gridTypes[gridIndex];
                maxCols = (maxCols <= gridType.cols)? gridType.cols : maxCols;
                maxRows = (maxRows <= gridType.rows)? gridType.rows : maxRows;
            }

            if(_gridTypes.length > 0){
                ctrl._selectedGridType = _gridTypes[0]
            }

            for(var rowIndex=0; rowIndex<maxRows; rowIndex++){
                _grid[rowIndex] = [];
                for(var colIndex=0; colIndex<maxCols; colIndex++){
                    _grid[rowIndex][colIndex] = {
                        active: (rowIndex <= (ctrl._selectedGridType.rows-1) && colIndex <= (ctrl._selectedGridType.cols-1)),
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