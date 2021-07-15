(function(angular) {
    'use strict';

    angular
        .module('previewer')
        .directive('previewer', function($timeout, $q){
            return {
                transclude: true,
                replace: false,
                scope: {
                    data: '=',
                    tileSize: '@',
                    gridSize: '=',
                    hexShape: '='
                },
                restrict: 'E',
                templateUrl: '/components/previewer/previewer.html',
                link: function (scope, element) {
                    var TILE_SPACE = 1;
                    var tileWidth = 50;
                    var tileHeight = 50;
                    var loading = false;
                    var gridSize = scope.gridSize;
                    var hexShape = scope.hexShape;

                    scope.htmlPattern = '';

                    scope.$on('imageChanged', function ($event, image) {
                        if(image) {
                            if(image.url){
                                loading = true;
                                createPreview(image);
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
                            var SVGTypes = {
                                'path': svg.getElementsByTagName('path'),
                                'polygons': svg.getElementsByTagName('polygon'),
                                'rect': svg.getElementsByTagName('rect'),
                                'polylines': svg.getElementsByTagName('polyline'),
                                'circle': svg.getElementsByTagName('circle'),
                                'ellipses': svg.getElementsByTagName('ellipse')
                            };
                            var SVGTypesKeys = Object.keys(SVGTypes);
                            for(var typeIndex=0; typeIndex<SVGTypesKeys.length; typeIndex++) {
                                var SVGType = SVGTypesKeys[typeIndex];
                                var SVGArray = SVGTypes[SVGType];

                                for(var elementIndex=0; elementIndex<SVGArray.length; elementIndex++){
                                    var element = SVGArray[elementIndex];
                                    if(element.id){
                                        if(tileData.custom_styles.path_styles[element.id]) {
                                            var pathStyle = tileData.custom_styles.path_styles[element.id];
                                            element.style.fill = pathStyle.fill;
                                            element.style.stroke = pathStyle.stroke;
                                        }
                                    }
                                }
                            }


                            return new XMLSerializer().serializeToString(svg);

                        } else {

                            var SVGObject = document.createElement('svg');
                            var GObject = document.createElement('g');

                            d3.select(SVGObject)
                                .attr('xmlns', 'http://www.w3.org/2000/svg')
                                .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
                                .attr('version', '1.1')
                                .attr('viewBox', '0 0 567 567')
                                .attr('style', 'enable-background:new 0 0 567 567;')
                                .attr('xml:space', 'preserve');

                            d3.select(GObject)
                                .attr('transform-origin', 'right bottom');

                            d3.select(GObject).append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('width', '100%')
                                .attr('height', '100%')
                                .attr('fill', '#FFFFFF')
                                .attr('stroke', '#000000');

                            SVGObject.appendChild(GObject);

                            return SVGObject.outerHTML;

                        }

                    }

                    function createImage(url, imageOptions, ctx) {
                        return $q(function (resolve, reject) {
                            var TO_RADIANS = Math.PI/180;
                            var image = new Image();
                            image.setAttribute('style', 'width: ' + imageOptions.width + 'px; height: ' + imageOptions.height + 'px;');
                            image.onload = function() {
                                ctx.save();
                                ctx.translate((imageOptions.x + (imageOptions.width/2)), imageOptions.y + (imageOptions.height/2));
                                ctx.rotate(imageOptions.degrees * TO_RADIANS);
                                ctx.drawImage(this, -(imageOptions.width/2), -(imageOptions.height/2), imageOptions.width, imageOptions.height);
                                ctx.restore();
                                resolve();
                            };
                            image.src = url;
                        });

                    }

                    function createPreview(image) {

                        var _grid = angular.copy(scope.data);
                        var tmpWidth = 0;
                        var tmpHeight = 0;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext('2d');
                        var images = [];

                        var imageContainer = document.createElement("div");
                        imageContainer.setAttribute('id', 'image-container');
                        imageContainer.setAttribute('style', 'display: inline-block');

                        var bgImage = d3.select('#previewer-image')
                            .node();

                        // Set grid's height and width to previewer-image height and width
                        bgImage.onload = function () {
                            var gridElement = (element[0]).querySelector('#grid');
                            gridElement.setAttribute('style', 'width: ' + this.width + 'px; height: ' + this.height + 'px;')
                        };

                        bgImage.src = image.url;

                        if(_grid) {

                            if (hexShape) {

                                // hexagon numbers
                                var hexSide = (tileWidth/2) * 1.15;
                                tileHeight = hexSide * 2;
                                tmpHeight = hexSide;

                                for(var row = 0; row < gridSize; row++) {
                                    tmpWidth = 0;
                                    if( row % 2 != 0 ){   // is hex and row is even
                                        tmpWidth += (tileWidth/2);
                                    }
                                    for(var cellIndex = 0; cellIndex < gridSize; cellIndex++) {
                                        if(_grid[row][cellIndex].active) {

                                            var tileId = _grid[row][cellIndex].id;
                                            var SVGContainer = document.createElement('div');

                                            SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                                            SVGContainer.setAttribute('class', 'svg-tile');
                                            SVGContainer.innerHTML = processXML(_grid[row][cellIndex].tile);

                                            var svg = SVGContainer.querySelector('svg');
                                            svg.setAttribute('version', '1.1');
                                            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                                            svg.setAttribute('height', tileHeight);
                                            svg.setAttribute('width', tileWidth);

                                            var degrees = '0';
                                            if (_grid[row][cellIndex].tile) {
                                                degrees = _grid[row][cellIndex].tile.custom_styles.rotation;
                                            }
                                            var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg.outerHTML);
                                            var imageOptions = {
                                                x: tmpWidth,
                                                y: tmpHeight,
                                                width: tileWidth,
                                                height: tileHeight,
                                                degrees: degrees,
                                                url: imgsrc
                                            };

                                            images.push(createImage(imgsrc, imageOptions, ctx));

                                            // Is even row and s the last tile of the row
                                            if ( (row % 2 != 0) && (cellIndex == (gridSize-1)) ) {
                                                var imageOptions = {
                                                    x: (tileWidth/-2) - TILE_SPACE,
                                                    y: tmpHeight,
                                                    width: tileWidth,
                                                    height: tileHeight,
                                                    degrees: degrees,
                                                    url: imgsrc
                                                };
                                                images.push(createImage(imgsrc, imageOptions, ctx));
                                            }

                                            // Is the last row
                                            if (row == (gridSize-1)) {

                                                var imageOptions = {
                                                    x: tmpWidth,
                                                    y: (hexSide/-2) - TILE_SPACE,
                                                    width: tileWidth,
                                                    height: tileHeight,
                                                    degrees: degrees,
                                                    url: imgsrc
                                                };

                                                images.push(createImage(imgsrc, imageOptions, ctx));

                                                // Is the last tile of the last row
                                                if ( cellIndex == (gridSize-1) ){

                                                    var imageOptions = {
                                                        x: (tileWidth/-2) - TILE_SPACE,
                                                        y: (hexSide/-2) - TILE_SPACE,
                                                        width: tileWidth,
                                                        height: tileHeight,
                                                        degrees: degrees,
                                                        url: imgsrc
                                                    };
                                                    images.push(createImage(imgsrc, imageOptions, ctx));
                                                }

                                            }

                                            tmpWidth+= tileWidth + TILE_SPACE;
                                        }
                                    }
                                    tmpHeight += (hexSide * 1.5) + TILE_SPACE;
                                }

                                var canvasWidth = (tileWidth * gridSize) + (TILE_SPACE * gridSize);
                                var canvasHeight = (hexSide * gridSize * 1.5) + (TILE_SPACE * gridSize);

                            } else {
                                for(var row=0; row<_grid.length; row++) {
                                    tmpWidth = 0;
                                    for(var cellIndex=0; cellIndex<_grid[row].length; cellIndex++) {
                                        if(_grid[row][cellIndex].active) {

                                            var tileId = _grid[row][cellIndex].id;
                                            var SVGContainer = document.createElement('div');

                                            SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                                            SVGContainer.setAttribute('class', 'svg-tile');
                                            SVGContainer.innerHTML = processXML(_grid[row][cellIndex].tile);

                                            var svg = SVGContainer.querySelector('svg');
                                            svg.setAttribute('version', '1.1');
                                            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                                            svg.setAttribute('height', tileHeight);
                                            svg.setAttribute('width', tileWidth);

                                            var degrees = '0';
                                            if (_grid[row][cellIndex].tile) {
                                                degrees = _grid[row][cellIndex].tile.custom_styles.rotation;
                                            }
                                            var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg.outerHTML);
                                            var imageOptions = {
                                                x: tmpWidth,
                                                y: tmpHeight,
                                                width: tileWidth,
                                                height: tileHeight,
                                                degrees: degrees,
                                                url: imgsrc
                                            };

                                            images.push(createImage(imgsrc, imageOptions, ctx));
                                            tmpWidth+= tileWidth + TILE_SPACE;
                                        }
                                    }
                                    tmpHeight += tileHeight + TILE_SPACE;
                                }

                                var canvasWidth = (tileWidth * gridSize) + (TILE_SPACE * gridSize);
                                var canvasHeight = (tileHeight * gridSize) + (TILE_SPACE * gridSize);
                            }

                            canvas.width  = canvasWidth;
                            canvas.height = canvasHeight;
                            canvas.style.width  = canvasWidth + 'px';
                            canvas.style.height = canvasHeight + 'px';

                            $q.all(images).then(function () {
                                var backgroundUrl = canvas.toDataURL("image/png");
                                var tmpImage = document.createElement('img');
                                tmpImage.src= backgroundUrl;
                                tmpImage.style.width  = canvasWidth + 'px';
                                tmpImage.style.height = canvasHeight + 'px';

                                switch(image.code) {
                                    case ('backsplash'):
                                        d3.select('#grid')
                                            .style('perspective', '0px')
                                            .style('perspective-origin', '50% 50%');

                                        var bgSize = (gridSize * 10)/2 + '%';
                                        d3.select('#grid-inner-wrapper')
                                            .style('background', 'transparent url(' + backgroundUrl + ') repeat top left')
                                            .style('background-size', bgSize)
                                            .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)')
                                            .style('height', '100%')
                                            .style('width', '100%');

                                        break;

                                    case ('bathroom'):
                                        d3.select('#grid')
                                            .style('perspective', '500px')
                                            .style('perspective-origin', '50% 50%');

                                        var bgSize = (gridSize * 5)/2 + '%';
                                        d3.select('#grid-inner-wrapper')
                                            .style('background', 'transparent url(' + backgroundUrl + ') repeat top left')
                                            .style('background-size', bgSize)
                                            .style('transform', 'rotateX(75deg) rotateY(0deg) rotateZ(0deg) translate(0%, 60%)')
                                            .style('height', '100%')
                                            .style('width', '100%');

                                        break;

                                    case ('dining-room'):
                                        d3.select('#grid')
                                            .style('perspective', '500px')
                                            .style('perspective-origin', '50% 50%');

                                        var bgSize = (gridSize * 7)/2 + '%';
                                        d3.select('#grid-inner-wrapper')
                                            .style('background', 'transparent url(' + backgroundUrl + ') repeat top left')
                                            .style('background-size', bgSize)
                                            .style('transform', 'rotateX(70deg) rotateY(0deg) rotateZ(0deg) translate(0%, 80%)')
                                            .style('height', '100%')
                                            .style('width', '100%');

                                        break;

                                    case ('living-room'):
                                        d3.select('#grid')
                                            .style('perspective', '500px')
                                            .style('perspective-origin', '50% 50%');

                                        var bgSize = (gridSize * 5)/2 + '%';
                                        d3.select('#grid-inner-wrapper')
                                            .style('background', 'transparent url(' + backgroundUrl + ') repeat top left')
                                            .style('background-size', bgSize)
                                            .style('transform', 'rotateX(70deg) rotateY(0deg) rotateZ(0deg) translate(0%, 80%)')
                                            .style('height', '100%')
                                            .style('width', '100%');

                                        break;

                                    case ('kitchen'):
                                        d3.select('#grid')
                                            .style('perspective', '0px')
                                            .style('perspective-origin', '50% 50%');

                                        var bgSize = (gridSize * 10)/2 + '%';
                                        d3.select('#grid-inner-wrapper')
                                            .style('background', 'transparent url(' + backgroundUrl + ') repeat top left')
                                            .style('background-size', bgSize)
                                            .style('transform', 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate(0%, 0%)')
                                            .style('height', '100%')
                                            .style('width', '100%');

                                        break;

                                    default:
                                        break;
                                }

                                d3.select('#image-container')
                                    .style('display', 'none');
                            });

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
