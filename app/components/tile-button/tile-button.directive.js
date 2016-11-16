(function(angular) {
    'use strict';

    angular
        .module('tileButton')
        .directive('tileButton', function(){
            return {
                transclude: true,
                replace: true,
                scope: {
                    tile: '@'
                },
                restrict: 'E',
                link: function (scope, element) {

                    var tileButton;
                    var SVGObject;
                    var tileData = JSON.parse(scope.tile);
                    var svg = (element[0]).getElementsByTagName('svg');
                    
                    var paintTile = function () {
                        SVGObject = svg[0];

                        var SVGTypes = {
                            'path': SVGObject.getElementsByTagName('path'),
                            'polygons': SVGObject.getElementsByTagName('polygon'),
                            'rect': SVGObject.getElementsByTagName('rect'),
                            'polylines': SVGObject.getElementsByTagName('polyline'),
                            'circle': SVGObject.getElementsByTagName('circle'),
                            'ellipses': SVGObject.getElementsByTagName('ellipse')
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

                    };

                    if(tileData){
                        // Print SVG
                        tileButton = angular.element(element)[0];
                        tileButton.innerHTML = tileData.xml;
                        paintTile();
                    }
                }
            };
        });

})(window.angular);