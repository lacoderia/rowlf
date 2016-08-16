(function(angular) {
    'use strict';

    function builderController($mdPanel, $mdDialog, $location, $scope, $rootScope, collectionGrids, collectionTilesService, builderService, summaryService) {

        var ctrl = this;
        var _selectedTiles = [];
        var _tmpSelectedTiles = [];
        var _selectedTile;
        var _tmpTile;
        var _selectedCollectionTiles = [];
        var _gridTypes;
        var _grid = [];
        var _rowStyle;
        var _cellStyle;
        var _selectedCell;
        var _mdPanel = undefined;
        var _colors = [];
        ctrl.ACTIONS = {
            'EDIT': {code: 'EDIT'},
            'SAVE': {code: 'SAVE'},
            'DELETE': {code: 'DELETE'}
        };
        ctrl.GRID_ACTIONS = {
            'ROTATE': {code: 'ROTATE'},
            'DELETE': {code: 'DELETE'}
        };
        ctrl._selectedGridType =undefined;
        ctrl.selectedColor = undefined;
        ctrl.tileQuery = '';

        ctrl.callAction = function ($event, action, tile) {
            $event.preventDefault();
            $event.stopPropagation();

            switch (action){
                case ctrl.ACTIONS['EDIT'].code:
                    if(tile) {
                        ctrl.openCustomizer(tile)
                    }
                    break;
                case ctrl.ACTIONS['DELETE'].code:
                    if(_selectedTile){
                        ctrl.deleteTile();
                    }
                    break;
                case ctrl.ACTIONS['SAVE'].code:
                    ctrl.saveCustomizer();
                    break;
            }
        };

        ctrl.callGridAction = function($event, action) {
            $event.preventDefault();
            $event.stopPropagation();

            switch (action){
                case ctrl.GRID_ACTIONS['ROTATE'].code:
                    if(_selectedCell){
                        $rootScope.$broadcast('rotateTile', _selectedCell.id);
                    }
                    break;
                case ctrl.GRID_ACTIONS['DELETE'].code:
                    if(_selectedCell){
                        _selectedCell.tile = undefined;
                        _selectedCell = undefined;
                    }
                    break;
            }
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
            refreshSelectedTiles();
        });

        var refreshSelectedTiles = function() {
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

        ctrl.deleteTile = function() {
            for(var i=0; i<_selectedTiles.length; i++) {
                if(_selectedTiles[i].tmpId == _selectedTile.tmpId) {
                    _selectedTiles.splice(i, 1);
                    _selectedTile = undefined;
                    break;
                }
            }
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

        ctrl.selectTile = function ($event, tile) {
            if(ctrl.isSelectedTile(tile)){
                _selectedTile = undefined;
            }else{
                _selectedTile = tile;
            }
        };

        ctrl.isSelectedTile = function (tile) {
            if(_selectedTile){
                return (_selectedTile.tmpId == tile.tmpId);
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

        ctrl.setSelectedGridType = function (gridType) {
            ctrl._selectedGridType = gridType;
            collectionGrids.setSelectedGridType(gridType);

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
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.getRowStyle = function (row) {
            var _rowStyle = {
                'height': '0px',
                'width': '100%'
            };

            for(var i=0; i<row.length; i++){
                if(row[i].active){
                    _rowStyle.height = (100 / ctrl._selectedGridType.cols) + '%';
                    break;
                }
            }

            return _rowStyle;
        };

        ctrl.getCellStyle = function () {

            return _cellStyle = {
                'height': '100%',
                'width': (100/ctrl._selectedGridType.cols)+'%',
                'vertical-align': 'top'
            };
        };

        ctrl.selectCell = function(cell) {
            if(cell.tile){
                if(!_selectedCell){
                    _selectedCell = cell;
                }else{
                    _selectedCell = undefined;
                }
            }else{
                _selectedCell = undefined;
                ctrl.copyTileToGrid(cell);
            }
        };

        ctrl.isSelectedCell = function(cellId) {
            return (_selectedCell)? (_selectedCell.id == cellId): false;
        };

        ctrl.copyTileToGrid = function(cell) {

            if(_selectedTile) {
                for(var i=0; i<_grid.length; i++) {
                    for(var j=0; j<_grid[i].length; j++) {
                        if(_grid[i][j].id == cell.id) {
                            cell.tile = angular.copy(_selectedTile);
                            _grid[i][j] = angular.copy(cell);
                            return;
                        }
                    }
                }
            }
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
                if(_selectedTiles[i].tmpId == _selectedTile.tmpId){
                    _selectedTiles[i] = angular.copy(_selectedTile);
                }
            }
            ctrl.closeCustomizer();
        };

        /**
         *
         */
        ctrl.completeStep = function() {
            summaryService.setSummary(_grid);
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[1].data);
        };

        /**
         *
         */
        ctrl.startOver = function($event) {
            var confirm = $mdDialog.confirm()
                .title('Do you want to go back to the previous step?')
                .textContent('All your changes will be lost, and you will have to start over again')
                .ariaLabel('Previous step')
                .targetEvent($event)
                .ok('Yes, take me back!')
                .cancel('No, keep me here');
            $mdDialog.show(confirm).then(function() {
                $location.path('/');
            }, function() {

            });
        };

        /**
         *
         * @returns {boolean}
         */
        ctrl.isDisabled = function() {
            var disabled = true;

            for(var i=0; i<_grid.length; i++){
                for(var j=0; j<_grid.length; j++){
                    if(_grid[i][j].tile){
                        disabled = false;
                        break;
                    }
                }
            }

            return disabled;
        };

        ctrl.$onInit = function() {

            _gridTypes = collectionGrids.getCollectionGrids();
            if(!_colors.length > 0){
                _colors = builderService.callColors().then(
                    function () {
                        _colors = builderService.getColors();
                        if(_colors.length > 0){
                            ctrl.setColor(_colors[0]);
                        }
                    }
                );
            }

            var maxCols = 0;
            var maxRows = 0;

            for(var gridIndex=0; gridIndex<_gridTypes.length; gridIndex++){
                var gridType = _gridTypes[gridIndex];
                maxCols = (maxCols <= gridType.cols)? gridType.cols : maxCols;
                maxRows = (maxRows <= gridType.rows)? gridType.rows : maxRows;
            }

            var cellId = 0;
            for(var rowIndex=0; rowIndex<maxRows; rowIndex++){
                _grid[rowIndex] = [];
                for(var colIndex=0; colIndex<maxCols; colIndex++){
                    _grid[rowIndex][colIndex] = {
                        id: cellId,
                        active: false,
                        tile: undefined
                    };
                    cellId++;
                }
            }

            if(_gridTypes.length > 0){
                ctrl.setSelectedGridType(_gridTypes[0]);
            }

        };
    }

    angular
        .module('builder')
        .component('builder', {
            templateUrl: 'components/builder/builder.template.html',
            controller: builderController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);