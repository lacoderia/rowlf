(function(angular) {
    'use strict';

    /*function tileCanvasController() {

        var ctrl = this;
        console.log(ctrl.canvasid)
        var buttonCanvas = angular.element(document.querySelector(ctrl.canvasid))[0];
        console.log(buttonCanvas);
    }*/

    angular
        .module('tileCanvas')
        .directive('tileCanvas', function(){
            return {
                transclude: true,
                replace: true,
                scope: {
                    tileurl: '@',
                    canvasid: '@',
                    tilexml: '@'
                },
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var tileButton = angular.element(element)[0];
                    tileButton.innerHTML = scope.tilexml;
                    scope.$watch('tilexml', function (newValue) {
                        if(newValue){
                            tileButton.innerHTML = scope.tilexml;
                        }
                    }, true);
                }
            };
        });

})(window.angular);