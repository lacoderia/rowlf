(function(angular) {
    'use strict';

    angular
        .module('tileGrid')
        .directive('tileGrid', function(){
            return {
                transclude: true,
                replace: true,
                scope: {
                    cellId: '=',
                    tile: '='
                },
                restrict: 'E',
                link: function (scope, element) {

                    var tileButton;
                    var SVGObject;
                    var tileData = scope.tile;
                    var svg = (element[0]).getElementsByTagName('svg');

                    var paintTile = function () {
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

                        if(tileData.custom_styles.rotation) {
                            d3.select(SVGObject)
                                .style('transform', 'rotate(' + tileData.custom_styles.rotation + 'deg)');
                        }
                    };

                    var rotateTile = function () {
                        if(tileData && SVGObject){
                            if(tileData.custom_styles.rotation == 270){
                                SVGObject.style.transform = 'rotate(0deg);';
                            }
                            tileData.custom_styles.rotation+= 90;
                            SVGObject.style.transform = 'rotate(' + tileData.custom_styles.rotation + 'deg)';
                        }
                    };

                    if(tileData){
                        // Print SVG
                        tileButton = angular.element(element)[0];
                        tileButton.innerHTML = tileData.xml;
                        paintTile();
                    }

                    scope.$on('rotateTile', function ($event, cellId) {
                        if(scope.cellId == cellId){
                            rotateTile();
                        }
                    });
                }
            };
        });

})(window.angular);