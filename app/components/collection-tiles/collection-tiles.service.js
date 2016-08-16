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

        function parseXML(xml, tileId) {
            if(xml){
                var parser = new DOMParser();
                var svg = parser.parseFromString(xml, "application/xml");
                var SVGPolygons = svg.getElementsByTagName('polygon');
                var SVGPaths = svg.getElementsByTagName('path');
                var pathStyles = {};

                svg.getElementsByTagName('svg')[0].id = 'tile_' + tileId;
                for(var pathIndex=0; pathIndex<SVGPaths.length; pathIndex++){
                    var id = 'tile_' + tileId + '_path_' + (pathIndex+1);
                    svg.getElementsByTagName('path')[pathIndex].id = id;
                    pathStyles[id] = {
                        fill: '#FFFFFF',
                        stroke: '#000000'
                    };
                }

                for(var pathIndex=0; pathIndex<SVGPolygons.length; pathIndex++){
                    var id = 'tile_' + tileId + '_polygon_' + (pathIndex+1);
                    svg.getElementsByTagName('polygon')[pathIndex].id = 'tile_' + tileId + '_polygon_' + (pathIndex+1);
                    pathStyles[id] = {
                        fill: '#FFFFFF',
                        stroke: '#000000'
                    };
                }
                return {
                    xmlString: new XMLSerializer().serializeToString(svg),
                    pathStyles: pathStyles
                };
            }

            return {
                xmlString: undefined,
                pathStyles: {}
            };
        }


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
                                var xmlParsed = parseXML(tile.xml, tile.id);
                                if(tile.active && tile.image){
                                    collectionTiles.tiles.push({
                                        id: tile.id,
                                        name: tile.name,
                                        url: AUTH_API_URL_BASE + tile.image,
                                        custom_styles: {
                                            rotation: 0,
                                            path_styles: xmlParsed.pathStyles
                                        },
                                        xml: xmlParsed.xmlString
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
            $rootScope.$broadcast('selectedCollectionTilesChange');
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
            $rootScope.$broadcast('selectedTilesChange');
        }

        /**
         *
         * @param tmpId
         * @returns {undefined}
         */
        function getTileByTmpId(tmpId) {
            var tiles = _selectedTiles.filter(function(item) {
                return item.tmpId == tmpId;
            });

            return (tiles.length > 0)? angular.copy(tiles[0]) : undefined;
        };

        function updateTileByTmpId(tmpId, customStyles) {
            var tiles = _selectedTiles.filter(function(item) {
                return item.tmpId == tmpId;
            });

            var tile = (tiles.length > 0)? tiles[0] : undefined;

            if(tile){
                tile.custom_styles = customStyles;
                $rootScope.$broadcast('updateSelectedTile', tile.tmpId, tile.custom_styles);
            }
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
            callTilesByCollectionId: callTilesByCollectionId,
            getTileByTmpId: getTileByTmpId,
            updateTileByTmpId: updateTileByTmpId
        };

        return service;
    }]);

})(window.angular);
