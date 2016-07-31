(function(angular) {
    'use strict';

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(){
            return {
                transclude: true,
                replace: true,
                scope: {
                    canvasid: '@',
                    tiledata: '@'
                },
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var tileData = JSON.parse(scope.tiledata);
                    var tileButton = angular.element(element)[0];
                    tileButton.innerHTML = tileData.xml;
                    scope.$watch('tiledata', function (newValue) {
                        if(newValue){
                            tileData = JSON.parse(newValue);
                            tileButton.innerHTML = tileData.xml;
                        }
                    }, true);
                }
            };
        });

})(window.angular);