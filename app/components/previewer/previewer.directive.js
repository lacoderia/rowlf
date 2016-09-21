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
                    var TILE_SPACE = 2;
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

                    function processXML(tileData) {

                        if(tileData){
                            if(tileData.xml) {
                                var parser = new DOMParser();
                                var svg = parser.parseFromString(tileData.xml, "application/xml");
                                var SVGPolygons = svg.getElementsByTagName('polygon');
                                var SVGPaths = svg.getElementsByTagName('path');
                                var SVGObject = svg.getElementsByTagName('svg');
                                var rotation = tileData.custom_styles.rotation;

                                SVGObject[0].style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';

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
                            .attr('transform-origin', 'right bottom').

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
                        var tmpWidth = TILE_SPACE;
                        var tmpHeight = TILE_SPACE;
                        //var SVGElement = undefined;
                        //var bbox = undefined;

                        if(!d3.select('#previewer-image').empty()) {
                            !d3.select('#previewer-image').remove();
                        }

                        var bgImage = d3.select(element[0]).append('img')
                            .attr('id', 'previewer-image')
                            .style('height', '100%')
                            .style('width', 'auto')
                            .node();

                        bgImage.onload = function () {
                            var gridElement = (element[0]).querySelector('#grid');
                            gridElement.setAttribute('style', 'width: ' + this.width + 'px; height: ' + this.height + 'px;')
                        };

                        bgImage.src = image.url;

                        if(scope.size){
                            tileWidth = scope.size * TILE_FACTOR;
                            tileHeight = scope.size * TILE_FACTOR;
                        }

                        if(_grid) {
                            var _gridWidthLength = TILE_SPACE;
                            var _gridHeightLength = TILE_SPACE;

                            for(var row=0; row<_grid.length; row++) {
                                tmpWidth = TILE_SPACE;
                                for(var cellIndex=0; cellIndex<_grid[row].length; cellIndex++) {
                                    if(_grid[row][cellIndex].active) {

                                        var tileId = _grid[row][cellIndex].id;
                                        var SVGContainer = document.createElement('div');

                                        SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                                        SVGContainer.setAttribute('class', 'svg-tile');
                                        SVGContainer.setAttribute('style', 'width: ' + tileWidth + 'px; height: ' + tileHeight + 'px;');
                                        SVGContainer.setAttribute('x', tmpWidth + 'px');
                                        SVGContainer.setAttribute('y', tmpHeight + 'px');

                                        _svgString= processXML(_grid[row][cellIndex].tile);
                                        SVGContainer.innerHTML = _svgString;

                                        (element[0]).appendChild(SVGContainer);

                                        _gridHeightLength = row + TILE_SPACE;
                                        _gridWidthLength = cellIndex + TILE_SPACE;
                                        tmpWidth+= tileWidth + TILE_SPACE;
                                    }
                                }
                                tmpHeight+= tileHeight + TILE_SPACE;
                            }

                            $timeout(function () {
                                generateImgFromSVGSting();
                                console.log('GENERAR IMAGEN');
                                html2canvas(element[0], {
                                    onrendered: function(canvas) {
                                        console.log('ENTRE AQUI')
                                        document.body.appendChild(canvas);

                                        // Convert and download as image
                                        Canvas2Image.saveAsPNG(canvas);
                                        (element[0]).appendChild(canvas);
                                        //$("#img-out").append(canvas);
                                        // Clean up
                                        //document.body.removeChild(canvas);
                                    }
                                });
                            },0)

                        }

                    }

                    function generateImgFromSVGSting() {

                        var SVGElements = d3.selectAll('.svg-tile');
                        var ImageContainer = document.createElement('div');
                        ImageContainer.setAttribute('id', 'image-container');
                        ImageContainer.setAttribute('style', 'position: relative;');
                        (element[0]).appendChild(ImageContainer);

                        SVGElements.each(function () {
                            var doctype = '<?xml version="1.0" standalone="no"?>'
                                + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                            var source = (new XMLSerializer()).serializeToString(d3.select(this).node());
                            var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
                            var url = window.URL.createObjectURL(blob);
                            var img = d3.select('#image-container').append('img')
                                .attr('width', tileWidth)
                                .attr('height', tileHeight)
                                .style('position', 'absolute')
                                .style('left', this.getAttribute('x'))
                                .style('top', this.getAttribute('y'))
                                .style('background', 'red')
                                .node();

                            img.onload = function () {
                                console.log('ENTRE AQUI')
                                //img.setAttribute('style', 'position: absolute; background: red;')
                            };

                            img.src = url;

                        });

                        /*
                        var doctype = '<?xml version="1.0" standalone="no"?>'
                            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                        var source = (new XMLSerializer()).serializeToString(d3.select('#svg-container > svg').node());
                        var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
                        var url = window.URL.createObjectURL(blob);
                        var img = d3.select(element[0]).append('img')
                            .attr('width', tileWidth)
                            .attr('height', tileHeight)
                            .attr('id', 'pattern-' + tileId)
                            .node();


                        switch(image.code) {
                            case ('hallway'):
                                img.onload = function () {
                                    d3.select('#grid')
                                        .style('perspective', '100px');

                                    d3.select('#grid-inner-wrapper')
                                        .style('background', 'transparent url(' + url + ') repeat top left')
                                        .style('background-size', 40 + 'px ' + 40 + 'px')
                                        .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skewX(0deg) skewY(0deg) translate(0%, 0%)');
                                };
                                break;
                            case ('dinner-room'):
                                img.onload = function () {
                                    d3.select('#grid-inner-wrapper')
                                        .style('background', 'transparent url(' + url + ') repeat top left')
                                        .style('background-size', 45 + 'px ' + 45 + 'px')
                                        .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)');;
                                };
                                break;
                            case ('bathroom'):
                                img.onload = function () {
                                    d3.select('#grid-inner-wrapper')
                                        .style('background', 'transparent url(' + url + ') repeat top left')
                                        .style('background-size', 45 + 'px ' + 45 + 'px')
                                        .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)');;
                                };
                                break;
                            case ('kitchen'):
                                img.onload = function () {
                                    d3.select('#grid-inner-wrapper')
                                        .style('background', 'transparent url(' + url + ') repeat top left')
                                        .style('background-size', 45 + 'px ' + 45 + 'px')
                                        .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)');;
                                };
                                break;
                            case ('living-room'):
                                img.onload = function () {
                                    d3.select('#grid-inner-wrapper')
                                        .style('background', 'transparent url(' + url + ') repeat top left')
                                        .style('background-size', 45 + 'px ' + 45 + 'px')
                                        .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)');;
                                };
                                break;
                        }

                        img.src = url;*/
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
