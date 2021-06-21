(function(angular) {
    'use strict';

    angular.module('tileDesignStudio').factory('collectionTilesService', ['$rootScope', '$http', 'collectionGrids', 'utilsService', 'AUTH_API_URL_BASE', function ($rootScope, $http, collectionGrids, utilsService, AUTH_API_URL_BASE) {

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
        };

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
                                    tiles: [],
                                    shape: tile_type.shape
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
                var pathStyles = {};
                var SVGTypes = {
                    'path': svg.getElementsByTagName('path'),
                    'polygons': svg.getElementsByTagName('polygon'),
                    'rect': svg.getElementsByTagName('rect'),
                    'polylines': svg.getElementsByTagName('polyline'),
                    'circle': svg.getElementsByTagName('circle'),
                    'ellipses': svg.getElementsByTagName('ellipse')
                };
                var SVGTypesKeys = Object.keys(SVGTypes);
                svg.getElementsByTagName('svg')[0].id = 'tile_' + tileId;

                for(var typeIndex=0; typeIndex<SVGTypesKeys.length; typeIndex++) {
                    var SVGType = SVGTypesKeys[typeIndex];
                    var SVGArray = SVGTypes[SVGType];

                    for(var elementIndex=0; elementIndex<SVGArray.length; elementIndex++){
                        var id = 'tile_' + tileId + '_' + SVGType + '_' + (elementIndex+1);
                        SVGArray[elementIndex].id = id;
                        pathStyles[id] = {
                            fill: '#FFFFFF',
                            stroke: '#000000'
                        };
                    }
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


        function callTilesByCollection(collection) {
            var serviceURL = AUTH_API_URL_BASE + '/tiles/by_tile_type';
            return $http.get(serviceURL, { params: { tile_type: collection.id } }).then(
                function (response) {
                    try{
                        if(response.data){
                            var collectionTiles = getCollectionTilesById(collection.id);
                            collectionTiles.tiles = [];
                            for(var itemIndex=0; itemIndex<response.data.tiles.length; itemIndex++){
                                var tile = response.data.tiles[itemIndex];
                                var xmlParsed = parseXML(tile.xml, tile.id);
                                if(tile.active && tile.image){
                                    collectionTiles.tiles.push({
                                        id: tile.id,
                                        name: tile.name,
                                        sku: tile.sku,
                                        url: AUTH_API_URL_BASE + tile.image,
                                        custom_styles: {
                                            rotation: 0,
                                            path_styles: xmlParsed.pathStyles
                                        },
                                        xml: xmlParsed.xmlString,
                                        shape: collection.shape
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
         * @returns {undefined}
         */
        function getSelectedCollection() {
            return _selectedCollection;
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
            _selectedCollection = getCollectionTilesById(collectionId);
            collectionGrids.setSelectedCollection(_selectedCollection);
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
            getSelectedCollection: getSelectedCollection,
            setSelectedCollection: setSelectedCollection,
            getSelectedCollectionTiles: getSelectedCollectionTiles,
            getSelectedTiles: getSelectedTiles,
            setSelectedTiles: setSelectedTiles,
            callTilesByCollection: callTilesByCollection,
            getTileByTmpId: getTileByTmpId,
            updateTileByTmpId: updateTileByTmpId
        };

        return service;
    }]);

})(window.angular);
