
(function(angular) {

    'use strict';

    angular.module('tileDesignStudio').provider('collectionGrids', [function () {

        /**
         * Collection grids array
         */
        var _collectionGrids;

        /**
         * Selected collection
         */
        var _selectedGridType;

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
         *
         */
        function getSelectedGridType() {
            return angular.copy(_selectedGridType);
        }

        function setSelectedGridType(gridType) {
            _selectedGridType = gridType;
        }

        /**
         * Provider "collectionGrids" definition
         * @returns {{getCollectionGrids: getCollectionGrids, setCollectionGrids: setCollectionGrids, setSelectedCollectionGrids: setSelectedCollectionGrids}}
         */
        this.$get = function() {
            return {
                getCollectionGrids: getCollectionGrids,
                setCollectionGrids: setCollectionGrids,
                getSelectedGridType: getSelectedGridType,
                setSelectedGridType: setSelectedGridType
            }
        };

    }]);

})(window.angular);
