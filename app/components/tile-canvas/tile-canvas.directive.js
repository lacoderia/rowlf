(function(angular) {
    'use strict';

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(collectionTilesService){
            return {
                transclude: true,
                replace: true,
                scope: {
                    tile: '=',
                    getSelectedColor: '='
                },
                restrict: 'E',
                link: function (scope, element, attrs) {

                    var tileButton;
                    var SVGObject;
                    var SVGPaths;
                    var tileData = scope.tile;
                    var getSelectedColor = scope.getSelectedColor;

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

                    }
                }
            };
        });

})(window.angular);