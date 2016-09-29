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
                    var TILE_FACTOR = 6;
                    var TILE_SPACE = 1;
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

                        if(tileData && tileData.xml){
                            var parser = new DOMParser();
                            var svg = parser.parseFromString(tileData.xml, "application/xml");
                            var SVGPolygons = svg.getElementsByTagName('polygon');
                            var SVGPaths = svg.getElementsByTagName('path');

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

                        } else {

                            var SVGObject = document.createElement('svg');
                            var GObject = document.createElement('g');

                            d3.select(GObject)
                                .attr('width', tileWidth)
                                .attr('height', tileHeight)
                                .attr('transform-origin', 'right bottom');

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

                    }

                    function createPreview(image) {

                        var _grid = angular.copy(scope.data);
                        var containerElement = (element[0].querySelector('#image-container'));
                        var _svgString = '';
                        var tmpWidth = TILE_SPACE;
                        var tmpHeight = TILE_SPACE;

                        d3.select('#image-container')
                            .style('display', 'inline-block');

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

                            for(var row=0; row<_grid.length; row++) {
                                tmpWidth = TILE_SPACE;
                                for(var cellIndex=0; cellIndex<_grid[row].length; cellIndex++) {
                                    if(_grid[row][cellIndex].active) {

                                        // Getting the SVG as String
                                        _svgString= processXML(_grid[row][cellIndex].tile);

                                        var tileId = _grid[row][cellIndex].id;
                                        var SVGContainer = document.createElement('div');

                                        SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                                        SVGContainer.setAttribute('class', 'svg-tile');
                                        SVGContainer.innerHTML = _svgString;

                                        var html = SVGContainer.querySelector('svg');
                                        html.setAttribute('version', '1.1');
                                        html.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                                        var degrees = '0';

                                        if (_grid[row][cellIndex].tile) {
                                            degrees = _grid[row][cellIndex].tile.custom_styles.rotation;
                                        }
                                        var rotation = 'rotate(' + degrees + 'deg)';
                                        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html.outerHTML);
                                        var img = '<img src="' + imgsrc + '" style="width: ' + tileWidth + 'px; height: ' + tileHeight + 'px; left: ' + tmpWidth +'px; top: ' + tmpHeight + 'px; transform: ' + rotation + '" >';

                                        containerElement.innerHTML+= img;
                                        tmpWidth+= tileWidth + TILE_SPACE;
                                    }
                                }
                                tmpHeight+= tileHeight + TILE_SPACE;
                            }

                            var images = containerElement.querySelectorAll('img');
                            var maxHeight = 0;
                            var maxWidth = 0;
                            for(var imageIndex=0; imageIndex<images.length; imageIndex++) {
                                var tmpImage = images[imageIndex];

                                if (tmpImage.offsetTop > maxHeight) {
                                    maxHeight = tmpImage.offsetTop + tileHeight;
                                }

                                if(tmpImage.offsetLeft > maxWidth) {
                                    maxWidth = tmpImage.offsetLeft + tileWidth;
                                }
                            }
                            containerElement.setAttribute('style', 'width: ' + maxWidth + 'px; height: ' + maxHeight + 'px;');

                            $timeout(function () {
                                domtoimage.toPng(containerElement)
                                    .then(function(url) {

                                        switch(image.code) {
                                            case ('hallway'):
                                                d3.select('#grid')
                                                    .style('perspective', '187px')
                                                    .style('perspective-origin', '0% 0%');

                                                d3.select('#grid-inner-wrapper')
                                                    .style('background', 'transparent url(' + url + ') repeat top left')
                                                    .style('background-size', 40 + 'px ' + 40 + 'px')
                                                    .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)')
                                                    .style('height', '100%')
                                                    .style('width', '100%');

                                                d3.select('#previewer-image')
                                                    .style('height', '477px')
                                                    .style('width', '358px');

                                                break;
                                            case ('dining-room'):

                                                d3.select('#grid')
                                                    .style('perspective', '400px')
                                                    .style('perspective-origin', '87% 25%');

                                                d3.select('#grid-inner-wrapper')
                                                    .style('background', 'transparent url(' + url + ') repeat top left')
                                                    .style('background-size', 40 + 'px ' + 40 + 'px')
                                                    .style('transform', 'rotateX(0deg) rotateY(-24deg) rotateZ(0deg) translate(17%, 0%)')
                                                    .style('height', '100%')
                                                    .style('width', '100%');

                                                break;
                                            case ('bathroom'):

                                                d3.select('#grid')
                                                    .style('perspective', '395px')
                                                    .style('perspective-origin', '78% 111%');

                                                d3.select('#grid-inner-wrapper')
                                                    .style('background', 'transparent url(' + url + ') repeat top left')
                                                    .style('background-size', 40 + 'px ' + 40 + 'px')
                                                    .style('transform', 'rotateX(54deg) rotateY(0deg) rotateZ(0deg) translate(16%, 0%)')
                                                    .style('transform-origin', '0% 90%')
                                                    .style('height', '100%')
                                                    .style('width', '100%');

                                                break;
                                            case ('kitchen'):

                                                break;
                                            case ('living-room'):

                                                break;
                                        }

                                        d3.select('#image-container')
                                            .style('display', 'none');

                                    })
                                    .catch(function(error) {
                                        console.log(error);
                                    });
                            },0)

                        }

                    }

                    window.onresize = function() {
                        var width = d3.select("#previewer-image").style("width");
                        var height = d3.select("#previewer-image").style("height");

                        d3.select("#grid")
                            .style('height', height)
                            .style('width', width);
                    };

                }
            };
        });

})(window.angular);
