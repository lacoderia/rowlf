(function(angular) {
    'use strict';

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(collectionTilesService){
            return {
                transclude: true,
                replace: true,
                scope: {
                   tmpId: '@',
                    getSelectedColor: '='
                },
                restrict: 'E',
                link: function (scope, element, attrs) {

                    var tileButton;
                    var SVGObject;
                    var SVGPaths;
                    var tileData = collectionTilesService.getTileByTmpId(scope.tmpId);
                    var getSelectedColor = scope.getSelectedColor;

                    function updateTile() {
                        collectionTilesService.updateTileByTmpId(tileData.tmpId, tileData.custom_styles);
                    }

                    var rotateTile = function () {
                        if(tileData && SVGObject){
                            if(tileData.custom_styles.rotation == 270){
                                SVGObject.style.transform = 'rotate(0deg);';
                            }
                            tileData.custom_styles.rotation+= 90;
                            SVGObject.style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                            updateTile();
                        }
                    };

                    if(tileData){
                        // Print SVG
                        tileButton = angular.element(element)[0];
                        tileButton.innerHTML = tileData.xml;
                        SVGObject = (element[0]).getElementsByTagName('svg')[0];
                        SVGPaths = (element[0]).getElementsByTagName('path');

                        for(var pathIndex=0; pathIndex<SVGPaths.length; pathIndex++){
                            var path = SVGPaths[pathIndex];
                            if(path.id){
                                if(tileData.custom_styles.path_styles[path.id]) {
                                    var pathStyle = tileData.custom_styles.path_styles[path.id];
                                    path.style.fill = pathStyle.fill;
                                    path.style.stroke = pathStyle.stroke;
                                }
                            }
                        }

                        SVGObject.addEventListener('click', function (event) {
                            var path = event.target;
                            var selectedColor = getSelectedColor();
                            path.style.fill = selectedColor.hex_value;
                            path.style.stroke = selectedColor.hex_value;
                            tileData.custom_styles.path_styles[path.id] = {
                                fill: selectedColor.hex_value,
                                stroke: selectedColor.hex_value
                            };
                        });

                        scope.$on('updateTile', function($event, tmpId) {
                            if(tileData.tmpId == tmpId){
                                updateTile();
                            }
                        });

                        scope.$on('rotateTile', function($event, tmpId) {
                            if(tileData.tmpId == tmpId){
                                rotateTile();
                            }
                        });
                    }

                   /* var tileData;
                    var tileCanvas;
                    var SVGObject;
                    var SVGPaths;

                    var save = scope.save;

                    var rotateTile = function () {
                        if(tileData && SVGObject){
                            if(tileData.custom_styles.rotation == 270){
                                SVGObject.style.transform = 'rotate(0deg);';
                            }
                            tileData.custom_styles.rotation+= 90;
                            SVGObject.style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                        }
                    };

                    var initTile = function(newValue) {
                        // Print SVG
                        tileCanvas = angular.element(element)[0];
                        tileData = JSON.parse(newValue);
                        tileCanvas.innerHTML = tileData.xml;

                        // Transform SVG element

                        SVGObject = (element[0]).getElementsByTagName('svg')[0];
                        SVGObject.style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                        SVGPaths = (element[0]).getElementsByTagName('path');

                        for(var pathIndex=0; pathIndex<SVGPaths.length; pathIndex++){
                            var path = SVGPaths[pathIndex];
                            if(path.id){
                                if(tileData.custom_styles.path_styles[path.id]) {
                                    var pathStyle = tileData.custom_styles.path_styles[path.id];
                                    path.style.fill = pathStyle.fill;
                                    path.style.stroke = pathStyle.stroke;
                                }
                            }
                        }

                        if(scope.type == 'canvas') {
                            SVGObject.addEventListener('click', function (event) {
                                var path = event.toElement;
                                var selectedColor = JSON.parse(scope.selectedColor);
                                path.style.fill = selectedColor.hex_value;
                                path.style.stroke = selectedColor.hex_value;
                            });
                        }
                    }

                    if(scope.tileData && scope.type){
                        try {
                            scope.$watch('tileData', function (newValue) {
                                if(newValue){
                                    initTile(newValue);
                                }
                            }, true);
                        } catch(error) {
                            console.log(error);
                        }
                    }

                    scope.$on('rotateTile', function ($event, tmpId) {
                        if(tileData.tmpId == tmpId){
                            rotateTile();
                        }
                    });
                */
                }
            };
        });

})(window.angular);