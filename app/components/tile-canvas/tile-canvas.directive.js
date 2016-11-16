(function(angular) {
    'use strict';

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(){
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
                    var tileData = scope.tile;
                    var getSelectedColor = scope.getSelectedColor;
                    var svg = (element[0]).getElementsByTagName('svg');

                    if(tileData){
                        // Print SVG
                        tileButton = angular.element(element)[0];
                        tileButton.innerHTML = tileData.xml;
                        SVGObject = svg[0];

                        var SVGTypes = {
                            'path': SVGObject.getElementsByTagName('path'),
                            'polygons': SVGObject.getElementsByTagName('polygon'),
                            'rect': SVGObject.getElementsByTagName('rect'),
                            'polylines': SVGObject.getElementsByTagName('polyline'),
                            'circle': SVGObject.getElementsByTagName('circle')
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

                        SVGObject.addEventListener('click', function (event) {
                            var path = event.target;
                            var selectedColor = getSelectedColor();
                            path.style.fill = selectedColor.hex_value;
                            path.style.stroke = selectedColor.hex_value;
                            tileData.custom_styles.path_styles[path.id] = {
                                fill: selectedColor.hex_value,
                                stroke: selectedColor.hex_value,
                                colorName: selectedColor.name
                            };
                        });
                    }
                }
            };
        });

})(window.angular);