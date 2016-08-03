(function(angular) {
    'use strict';

    angular
        .module('tileButton')
        .directive('tileButton', function(collectionTilesService){
            return {
                transclude: true,
                replace: true,
                scope: {
                    tile: '@',
                    getTileByTempId: '=',
                    getTileArray: '='
                },
                restrict: 'E',
                link: function (scope, element) {

                    var tileButton;
                    var SVGObject;
                    var SVGPaths;
                    var getTileByTempId = scope.getTileByTempId;
                    var getTileArray = scope.getTileArray;
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