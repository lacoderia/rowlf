
(function(angular) {

    'use strict';

    angular.module('omtApp').provider('collectionGrids', [function () {

        /**
         * Collection grids array
         */
        var _collectionGrids;

        /**
         * Selected collection
         */
        var _selectedCollection;

        /**
         * Gets collection grids
         * @returns {*}
         */
        function getCollectionGrids() {
            return angular.copy(_collectionGrids);
        }

        /**
         * Sets collection grids
         * @param collectionGrids
         */
        function setCollectionGrids(collectionGrids) {
            _collectionGrids = collectionGrids;
        }

        /**
         * Sets selected collection
         * @param collectionId
         */
        function setSelectedCollectionGrids(collectionId) {
            var collections = _collectionGrids.filter(function(item) {
                return item.id == collectionId;
            });

            if(collections.length > 0){
                _selectedCollection = collections[0];
            }

        }

        /**
         * Provider "collectionGrids" definition
         * @returns {{getCollectionGrids: getCollectionGrids, setCollectionGrids: setCollectionGrids, setSelectedCollectionGrids: setSelectedCollectionGrids}}
         */
        this.$get = function() {
            return {
                getCollectionGrids: getCollectionGrids,
                setCollectionGrids: setCollectionGrids,
                setSelectedCollectionGrids: setSelectedCollectionGrids
            }
        };

    }]);

})(window.angular);
