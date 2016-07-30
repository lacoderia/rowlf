(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('collectionTilesService', ['$rootScope', '$http', 'utilsService', 'AUTH_API_URL_BASE', function ($rootScope, $http, utilsService, AUTH_API_URL_BASE) {

        /**
         * Collection tiles array
         */
        var _collectionTiles = [];

        /**
         * Selected collection
         */
        var _selectedCollection = undefined;

        /**
         * Selected tiles
         */
        var _selectedTiles = [];

        /**
         *
         * @type {number}
         * @private
         */
        var _tileCount = 0;

        var getTileCount = function() {
            _tileCount++;
            return _tileCount;
        }

        var callCollectionTiles = function () {
            var serviceURL = AUTH_API_URL_BASE + '/tile_types';
            return $http.get(serviceURL, {}).then(
                function (response) {
                    try{
                        if(response.data){
                            _collectionTiles = [];
                            for(var itemIndex=0; itemIndex<response.data.tile_types.length; itemIndex++){
                                var tile_type = response.data.tile_types[itemIndex];
                                _collectionTiles.push({
                                    id: tile_type.key,
                                    title: tile_type.value,
                                    inches: tile_type.inches,
                                    centimeters: tile_type.centimeters,
                                    tiles: []
                                });
                            }
                        }
                    }catch(error){
                        console.log(error);
                    }
                },
                function (error) {
                    console.log(error);
                }
            );
        };

        function callTilesByCollectionId(collectionId) {
            var serviceURL = AUTH_API_URL_BASE + '/tiles/by_tile_type';
            return $http.get(serviceURL, { params: { tile_type: collectionId } }).then(
                function (response) {
                    try{
                        if(response.data){
                            var collectionTiles = getCollectionTilesById(collectionId);
                            collectionTiles.tiles = [];
                            for(var itemIndex=0; itemIndex<response.data.tiles.length; itemIndex++){
                                var tile = response.data.tiles[itemIndex];
                                if(tile.active && tile.image){
                                    collectionTiles.tiles.push({
                                        id: tile.id,
                                        name: tile.name,
                                        url: AUTH_API_URL_BASE + tile.image,
                                        custom_styles: {
                                            rotation: 0,
                                            object_styles: []
                                        },
                                        xml: tile.xml
                                    });
                                }
                            }
                        }
                    } catch(error){
                        console.log(error)
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }

        /**
         *
         */
        function getCollectionTiles() {
            return angular.copy(_collectionTiles);
        }

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
        function getSelectedCollectionTiles() {
            return angular.copy(_selectedCollection.tiles);
        }

        /**
         *
         * @param collectionId
         * @returns {Array}
         */
        function getCollectionTilesById(collectionId) {
            var collections = _collectionTiles.filter(function(item) {
                return item.id == collectionId;
            });

            return (collections.length > 0)? collections[0] : [];
        }

        /**
         *
         * @param selectedCollection
         */
        function setSelectedCollection(collectionId) {
            var selectedCollection = getCollectionTilesById(collectionId);
            _selectedCollection = selectedCollection;
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
            $rootScope.$broadcast('selectedTilesChange')
        }

        var service = {
            getTileCount: getTileCount,
            callCollectionTiles: callCollectionTiles,
            getCollectionTiles: getCollectionTiles,
            setCollectionTiles: setCollectionTiles,
            setSelectedCollection: setSelectedCollection,
            getSelectedCollectionTiles: getSelectedCollectionTiles,
            getSelectedTiles: getSelectedTiles,
            setSelectedTiles: setSelectedTiles,
            callTilesByCollectionId: callTilesByCollectionId
        };

        return service;
    }]);

})(window.angular);
