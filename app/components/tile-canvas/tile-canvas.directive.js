(function(angular) {
    'use strict';

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(){
            return {
                transclude: true,
                replace: true,
                scope: {
                    tileData: '@',
                    type: '@',
                    selectedColor: '@',
                    rotate: '='
                },
                restrict: 'E',
                link: function (scope, element, attrs) {

                    var parser = new DOMParser();
                    var tileData;
                    var tileCanvas;
                    var SVGObject;
                    var SVGPaths;

                    var rotateTile = function () {
                        if(tileData && SVGObject){
                            if(tileData.custom_styles.rotation == 270){
                                SVGObject.style.transform = 'rotate(0deg);';
                            }
                            tileData.custom_styles.rotation+= 90;
                            SVGObject.style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                        }
                    };

                    scope.$on('rotateTile', rotateTile);


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
                }
            };
        });

})(window.angular);