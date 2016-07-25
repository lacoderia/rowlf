(function(angular) {
    'use strict';

    angular.module('omtApp').factory('storeService', [function () {

        /**
         *
         * @type {any}
         * @private
         */
        var _selectedCollectionTile =  undefined;

        /**
         *
         * @type {Array<any>}
         * @private
         */
        var _selectedTiles = [];

        /**
         *
         * @type {Array<Any>}
         * @private
         */
        var _collectionTiles = [];

        /**
         *
         * @returns {*}
         */
        function getCollectionTiles() {
            return angular.copy(_collectionTiles);
        };

        /**
         *
         * @param collectionTiles
         */
        function setCollectionTiles(collectionTiles) {
            _collectionTiles = collectionTiles;
        }

        /**
         *
         * @returns {*}
         */
        function getSelectedCollectionTile() {
            return angular.copy(_selectedCollectionTile);
        };

        /**
         *
         * @param selectedCollectionTile
         */
        function setSelectedColeccionTile(selectedCollectionTile) {
            _selectedCollectionTile = selectedCollectionTile;
        }

        /**
         *
         * @returns {*}
         */
        function getSelectedTiles() {
            return angular.copy(_selectedTiles);
        }

        /**
         *
         * @param selectedTiles
         */
        function setSelectedTiles(selectedTiles) {
            _selectedTiles = selectedTiles;
        }

        var service = {
            getSelectedCollectionTile: getSelectedCollectionTile,
            setSelectedCollectionTile: setSelectedColeccionTile,
            getSelectedTiles: getSelectedTiles,
            setSelectedTile: setSelectedTiles,
            getCollectionTiles: getCollectionTiles,
            setCollectionTiles: setCollectionTiles
        };

        return service;
    }]);

})(window.angular);
