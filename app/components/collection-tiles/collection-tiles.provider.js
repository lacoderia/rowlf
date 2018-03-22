
(function(angular) {

    'use strict';

    angular.module('tileDesignStudio').provider('collectionGrids', [function () {

        /**
         * Collection grids array
         */
        var _collectionGrids;

        /**
         * Selected grid type (2x2, 5x5)
         */
        var _selectedGridType;

        /**
         * Selected tile collection
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
         * Gets selected grid type (2x2, 5x5)
         * @returns {*}
         */
        function getSelectedGridType() {
            return angular.copy(_selectedGridType);
        }

        /**
         * Sets selected grid type
         * @param gridType
         */
        function setSelectedGridType(gridType) {
            _selectedGridType = gridType;
        }

        /**
         * Gets selected grid size (2x2, 5x5)
         * @returns {*}
         */
        function getSelectedGridSize() {
            return (_selectedGridType ? angular.copy(_selectedGridType.cols) : undefined);
        }

        /**
         * Returns true if grid's shape is hexagonal
         * @param shape
         */
        function isHexagonalGrid(collection) {
            return (collection ? collection.shape == 'hex' : (_selectedCollection && _selectedCollection.shape == 'hex'));
        }

        /**
         * Sets selected collection
         * @param collection
         */
        function setSelectedCollection(collection) {
            _selectedCollection = collection;
        }

        /**
         * Provider "collectionGrids" definition
         * @returns {*}
         */
        this.$get = function() {
            return {
                getCollectionGrids: getCollectionGrids,
                setCollectionGrids: setCollectionGrids,
                getSelectedGridType: getSelectedGridType,
                setSelectedGridType: setSelectedGridType,
                getSelectedGridSize: getSelectedGridSize,
                isHexagonalGrid: isHexagonalGrid,
                setSelectedCollection: setSelectedCollection
            }
        };

    }]);

})(window.angular);
