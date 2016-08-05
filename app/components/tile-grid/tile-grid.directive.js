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
                    tile: '@'
                },
                restrict: 'E',
                link: function (scope, element) {

                    var tileButton;
                    var SVGObject;
                    var SVGPaths;
                    var tileData = JSON.parse(scope.tile);

                    var paintTile = function () {

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