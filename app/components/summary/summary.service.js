(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('summaryService', ['$rootScope', '$http', 'builderService', 'AUTH_API_URL_BASE', function ($rootScope, $http, builderService, AUTH_API_URL_BASE) {

        var _grid = [];
        var _tileDetails = [];

        function setSummary(grid) {
            setGrid(grid);
            setTileDetails();
            $rootScope.$broadcast('summaryChange');
        }

        function setGrid(grid) {
            _grid = angular.copy(grid);
        }

        function getGrid() {
            return _grid;
        }

        function getColorByHexValue(hexValue) {
            var colors = builderService.getColors();
            for(var colorIndex=0; colorIndex<colors.length; colorIndex++){
                var color = colors[colorIndex];
                if(color.hex_value == hexValue){
                    return color;
                }
            }
            return undefined;
        }

        function setTileDetails() {
            _tileDetails = [];
            var index;

            for(var i=0; i<_grid.length; i++) {
                for(var j=0; j<_grid[i].length; j++) {
                    if(_grid[i][j].tile){
                        index = getTileIndex(_grid[i][j].tile);
                        if( index == -1){
                            var tile = _grid[i][j].tile;
                            tile.count = 1;
                            tile.colors = [];

                            if(tile.custom_styles) {
                                for(var key in tile.custom_styles.path_styles) {
                                    var color = tile.custom_styles.path_styles[key].fill;
                                    tile.colors.push(color);
                                }
                            }

                            _tileDetails.push(tile);
                        } else {
                            _tileDetails[index].count++;
                        }
                    }
                }
            }

        }

        function getTileIndex(tile) {
            var index = -1;
            var tmpCustomStyles;
            for(var k=0; k<_tileDetails.length; k++) {
                tmpCustomStyles = _tileDetails[k].custom_styles;
                if(tmpCustomStyles && tile.custom_styles && JSON.stringify(tmpCustomStyles.path_styles) == JSON.stringify(tile.custom_styles.path_styles)){
                    index = k;
                    return index;
                }
            }

            return index;
        }

        function getTileDetails() {
            return _tileDetails;
        }

        var service = {
            setSummary: setSummary,
            getGrid: getGrid,
            getTileDetails: getTileDetails,
            getColorByHexValue: getColorByHexValue
        };

        return service;
    }]);

})(window.angular);
