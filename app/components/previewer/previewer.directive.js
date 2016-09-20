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

                    scope.$on('imageChanged', function ($event, image) {
                        if(image) {
                            if(image.url){
                                loading = true;
                                createPreview(image);
                                /*scope.imageUrl = image.url;
                                try {
                                    createPreview();
                                } catch(error) {
                                    loading = false;
                                    console.log(error);
                                }*/
                            }
                        }
                    });

                    scope.isLoading = function () {
                        return loading;
                    };

                    function processXML(tileData, tmpWidth, tmpHeight) {

                        if(tileData){
                            if(tileData.xml) {
                                var parser = new DOMParser();
                                var svg = parser.parseFromString(tileData.xml, "application/xml");
                                var SVGPolygons = svg.getElementsByTagName('polygon');
                                var SVGPaths = svg.getElementsByTagName('path');
                                var SVGObject =svg.getElementsByTagName('svg')[0];
                                var rotation = tileData.custom_styles.rotation;

                                //GObject.setAttribute('style', 'transform-origin: center; transform: rotate(' + rotation + 'deg)');

                                d3.select(SVGObject)
                                    .attr('width', tileWidth)
                                    .attr('height', tileHeight)
                                    .attr('x', tmpWidth)
                                    .attr('y', tmpHeight);


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

                        var SVGObject = document.createElement('svg');
                        var GObject = document.createElement('g');

                        d3.select(GObject)
                            .attr('width', tileWidth)
                            .attr('height', tileHeight)
                            .attr('transform-origin', 'right bottom')
                            .attr('transform', 'translate(' + tmpWidth + ', ' + tmpHeight + ')');

                        d3.select(GObject).append('rect')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('width', tileWidth)
                            .attr('height', tileHeight)
                            .attr('fill', '#FFFFFF')
                            .attr('stroke', '#E5E5E5');

                        SVGObject.appendChild(GObject);

                        return SVGObject.outerHTML;
                    }

                    function createPreview(image) {
                        var _grid = angular.copy(scope.data);
                        var _svgString = '';
                        var tmpWidth = 0;
                        var tmpHeight = 0;
                        var SVGContainer = undefined;
                        var SVGElement = undefined;
                        var bbox = undefined;

                        var bgImage = d3.select(element[0]).append('img')
                            .style('height', '100%')
                            .style('width', 'auto')
                            .node();

                        bgImage.onload = function () {
                            this.id = 'previewer-image';
                            var gridElement = (element[0]).querySelector('#grid');
                            gridElement.setAttribute('style', 'width: ' + this.width + 'px; height: ' + this.height + 'px;')
                        };

                        bgImage.src = image.url;

                        canvasWidth = element[0].clientWidth * GRID_FACTOR;
                        canvasHeight = element[0].clientHeight * GRID_FACTOR;

                        if(scope.size){
                            tileWidth = scope.size * TILE_FACTOR;
                            tileHeight = scope.size * TILE_FACTOR;
                        }

                        if(_grid) {
                            var _gridWidthLength = 0;
                            var _gridHeightLength = 0;
                            _svgString = '<svg>';
                            for(var row=0; row<_grid.length; row++) {
                                tmpWidth = 0;
                                for(var cellIndex=0; cellIndex<_grid[row].length; cellIndex++) {
                                    if(_grid[row][cellIndex].active) {
                                        _svgString+= processXML(_grid[row][cellIndex].tile, tmpWidth, tmpHeight);
                                        _gridHeightLength = row+1;
                                        _gridWidthLength = cellIndex+1;
                                        tmpWidth+= tileWidth + 1;
                                    }
                                }
                                tmpHeight+= tileHeight + 1;
                            }
                            _svgString+= '</svg>';

                            SVGContainer = element[0].querySelector('#svg-container');
                            SVGContainer.innerHTML = _svgString;

                            SVGElement = element[0].querySelector('#svg-container > svg');
                            bbox = SVGElement.getBBox();

                            SVGContainer.setAttribute('style', 'display: inline-block; width: ' + bbox.width + 'px; height: ' + bbox.height + 'px;');
                            SVGElement.setAttribute('viewBox', bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height);
                            SVGElement.setAttribute('width', bbox.width +'');
                            SVGElement.setAttribute('height', bbox.height +'');

                            $timeout(function () {
                                generateImgFromSVGSting(bbox.width, bbox.height, image);
                            },0)


                        }

                    }

                    function generateImgFromSVGSting(width, height, image) {

                        var doctype = '<?xml version="1.0" standalone="no"?>'
                            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                        var source = (new XMLSerializer()).serializeToString(d3.select('#svg-container > svg').node());
                        var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
                        var url = window.URL.createObjectURL(blob);
                        var img = d3.select(element[0]).append('img')
                            .attr('width', width)
                            .attr('height', height)
                            .node();

                        img.onload = function () {
                            d3.select('#grid-inner-wrapper')
                                .style('background', 'transparent url(' + url + ') repeat top left');
                        };

                        img.src = url;

                        switch(image.code) {
                            case ('hallway'):
                                d3.select('#grid-inner-wrapper')
                                    .style('background-size', 45 + 'px ' + 45 + 'px');
                                break;
                            case ('dinner-room'):
                                d3.select('#grid-inner-wrapper')
                                    .style('background-size', 45 + 'px ' + 45 + 'px');
                                break;
                            case ('bathroom'):
                                break;
                            case ('kitchen'):
                                break;
                            case ('living-room'):
                                break;
                        }
                    }

                   /* function processXML(tileData) {
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
                    }*/
                }
            };
        });

})(window.angular);
