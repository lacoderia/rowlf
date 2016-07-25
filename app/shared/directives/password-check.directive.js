(function(angular) {
    'use strict';

    angular.module('omtApp').directive('pwCheck', function() {
        return {
            require : 'ngModel',
            scope: {
                otherModelValue: "=pwCheck"
            },
            link : function(scope, element, attrs, ngModel) {

                function setValidity(bool) {
                    ngModel.$setValidity('pwCheck', bool);
                }

                ngModel.$parsers.push(function(value) {

                    if(value == scope.otherModelValue){
                        setValidity(true);
                    } else {
                        setValidity(false);
                    }
                    return value;
                })

            }
        }
    });

})(window.angular);

