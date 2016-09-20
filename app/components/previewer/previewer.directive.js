(function(angular) {
    'use strict';

    angular
        .module('previewer')
        .directive('previewer', function($timeout, $sce){
            return {
                transclude: true,
                replace: false,
                scope: {
                    data: '=',
                    size: '@'
                },
                restrict: 'E',
                templateUrl: '/components/previewer/previewer.html',
                link: function (scope, element) {
                    var GRID_FACTOR = 4;
                    var TILE_FACTOR = 6;
                    var canvasWidth = 0;
                    var canvasHeight = 0;
                    var currentWidth = 0;
                    var currentHeight = 0;
                    var tileWidth = 50;
                    var tileHeight = 50;
                    var loading = false;
                    scope.htmlPattern = '';
                    scope.imageUrl = undefined;

                    scope.$on('imageChanged', function ($event, image) {
                        if(image) {
                            if(image.url){
                                loading = true;
                                scope.imageUrl = image.url;
                                try {
                                    createPreview();
                                } catch(error) {
                                    loading = false;
                                    console.log(error);
                                }
                            }
                        }
                    });

                    scope.isLoading = function () {
                        return loading;
                    };

                    function processXML(tileData) {
                        if(tileData){
                            if(tileData.xml) {
                                var parser = new DOMParser();
                                var svg = parser.parseFromString(tileData.xml, "application/xml");
                                var SVGPolygons = svg.getElementsByTagName('polygon');
                                var SVGPaths = svg.getElementsByTagName('path');
                                var SVGObject = svg.getElementsByTagName('svg');

                                if(SVGObject) {
                                    if(SVGObject.length > 0){
                                        SVGObject[0].style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                                    }
                                }

                                for(var pathIndex=0; pathIndex<SVGPaths.length; pathIndex++){
                                    var path = SVGPaths[pathIndex];
                                    path.style.fill = tileData.custom_styles.path_styles[path.id].fill;
                                    path.style.stroke = tileData.custom_styles.path_styles[path.id].stroke;
                                }

                                for(var polygonIndex=0; polygonIndex<SVGPolygons.length; polygonIndex++){
                                    var polygon = SVGPolygons[polygonIndex];
                                    polygon.style.fill = tileData.custom_styles.path_styles[polygon.id].fill;
                                    polygon.style.stroke = tileData.custom_styles.path_styles[polygon.id].stroke;
                                }

                                return new XMLSerializer().serializeToString(svg);
                            }
                        }
                        return '';
                    }

                    function drawGrid(data, tmpWidth, tmpHeight, tileWidth, tileHeight) {

                        var _tmpWidth = tmpWidth;
                        var _tmpHeight = tmpHeight;
                        var span = '';

                        for(var rowIndex=0; rowIndex<data.length; rowIndex++){
                            _tmpWidth = tmpWidth;
                            for(var tileIndex=0; tileIndex<data[rowIndex].length; tileIndex++) {
                                var tile = data[rowIndex][tileIndex];
                                if(tile.active){
                                    span+= '<span style="top:' + _tmpHeight + 'px; left:' + _tmpWidth + 'px; width:' + tileWidth + 'px; height:' + tileHeight + 'px;">';
                                    span+= tile.tileProccesed;
                                    span+= '</span>';
                                    _tmpWidth+= tileWidth;
                                }
                            }
                            _tmpHeight+= tileHeight;
                        }

                        return span;
                    }

                    function drawPattern(data,gridHeightLength, gridWidthLength) {

                        var patternHtml = '';

                        while(currentHeight <= canvasHeight) {
                            currentWidth = 0;
                            while(currentWidth <= canvasWidth){
                                patternHtml+= drawGrid(data, currentWidth, currentHeight, tileWidth, tileHeight);
                                currentWidth+= gridWidthLength*tileWidth;
                            }
                            currentHeight+= gridHeightLength*tileHeight;
                        }

                        return patternHtml;
                    }

                    function createPreview() {
                        if(!scope.htmlPattern) {
                            var _grid = angular.copy(scope.data);
                            canvasWidth = element[0].clientWidth * GRID_FACTOR;
                            canvasHeight = element[0].clientHeight * GRID_FACTOR;

                            if(scope.size){
                                tileWidth = scope.size * TILE_FACTOR;
                                tileHeight = scope.size * TILE_FACTOR;
                            }

                            if(_grid) {
                                var _gridWidthLength = 0;
                                var _gridHeightLength = 0;
                                for(var row=0; row<_grid.length; row++) {
                                    for(var cellIndex=0; cellIndex<_grid[row].length; cellIndex++) {
                                        _grid[row][cellIndex].tileProccesed = processXML(_grid[row][cellIndex].tile);
                                        if(_grid[row][cellIndex].active) {
                                            _gridHeightLength = row+1;
                                            _gridWidthLength = cellIndex+1;
                                        }
                                    }
                                }
                            }

                            $timeout(function () {
                                var htmlPattern = drawPattern(_grid, _gridHeightLength, _gridWidthLength);
                                scope.htmlPattern = $sce.trustAsHtml(htmlPattern);
                                loading = false;
                            },0);
                        } else{
                            loading = false;
                        }
                    }
                }
            };
        });

})(window.angular);
