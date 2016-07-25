(function(angular) {
    'use strict';

    angular.module('omtApp').factory('utilsService', [function () {

        /**
         * Returns if an array has items
         * @param array
         * @returns {boolean}
         */
        function isEmpty(array) {
            if(array){
                return (array.length <= 0);
            }
            return false;
        }

        /**
         * Return if an item exists in an object array
         * @param array
         * @param objectProperty
         * @param value
         * @returns {boolean}
         */
        function existItem(array, objectProperty, value) {
            if(array){
                for(var itemIndex=0; itemIndex<array.length; itemIndex++){
                    var tmpItem = array[itemIndex];
                    if(tmpItem[objectProperty] == value){
                        return true;
                    }
                }
                return false;
            }
        }

        function getItem(array, objectProperty, value) {
            if(array){
                for(var itemIndex=0; itemIndex<array.length; itemIndex++){
                    var tmpItem = array[itemIndex];
                    if(tmpItem[objectProperty] == value){
                        return tmpItem;
                    }
                }
                return undefined;
            }
        }

        var service = {
            existItem: existItem,
            isEmpty: isEmpty,
            getItem: getItem
        };

        return service;
    }]);

})(window.angular);
