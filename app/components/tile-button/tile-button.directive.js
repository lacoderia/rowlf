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
                    var SVGPaths;
                    var SVGPolygons;
                    var tileData = JSON.parse(scope.tile);
                    
                    var paintTile = function () {

                        SVGObject = (element[0]).getElementsByTagName('svg')[0];
                        SVGPaths = (element[0]).getElementsByTagName('path');
                        SVGPolygons = (element[0]).getElementsByTagName('polygon');

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

                        for(var polygonIndex=0; polygonIndex<SVGPolygons.length; polygonIndex++){
                            var polygon = SVGPolygons[polygonIndex];
                            if(polygon.id){
                                if(tileData.custom_styles.path_styles[polygon.id]) {
                                    var polygonStyle = tileData.custom_styles.path_styles[polygon.id];
                                    polygon.style.fill = polygonStyle.fill;
                                    polygon.style.stroke = polygonStyle.stroke;
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