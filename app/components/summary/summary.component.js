(function(angular) {
    'use strict';

    function summaryController($scope, $timeout, summaryService, collectionGrids) {

        var ctrl = this;
        var _grid = [];
        var _rowStyle;
        var _cellStyle;
        var _tileDetails = [];

        $scope.$on('summaryChange', function(){
            refreshGrid();
            refreshTileDetails();
        });

        function processXML(tileData) {

            if(tileData){
                if(tileData.xml) {
                    var parser = new DOMParser();
                    var svg = parser.parseFromString(tileData.xml, "application/xml");
                    var SVGPolygons = svg.getElementsByTagName('polygon');
                    var SVGPaths = svg.getElementsByTagName('path');
                    var SVGObject = svg.getElementsByTagName('svg');

                    for(var pathIndex=0; pathIndex<SVGPaths.length; pathIndex++){
                        var path = SVGPaths[pathIndex];
                        path.style.fill = tileData.custom_styles.path_styles[path.id].fill;
                        path.style.stroke = tileData.custom_styles.path_styles[path.id].stroke;
                    }

                    for(var polygonIndex=0; polygonIndex<SVGPolygons.length; polygonIndex++){
                        var polygon = SVGPolygons[polygonIndex];
                        polygon.style.fill = tileData.custom_styles.path_styles[polygon.id].fill;
                        polygon.style.stroke = tileData.custom_styles.path_styles[polygon.id].stroke;
                    }

                    return new XMLSerializer().serializeToString(svg);
                }
            }

            var SVGObject = document.createElement('svg');
            var GObject = document.createElement('g');

            d3.select(GObject)
                .attr('width', tileWidth)
                .attr('height', tileHeight)
                .attr('transform-origin', 'right bottom').

            d3.select(GObject).append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', tileWidth)
                .attr('height', tileHeight)
                .attr('fill', '#FFFFFF')
                .attr('stroke', '#E5E5E5');

            SVGObject.appendChild(GObject);

            return SVGObject.outerHTML;
        }

        function createPreview() {
            var TILE_SPACE = 1;
            var tileWidth = 100;
            var tileHeight = 100;
            var localGrid = angular.copy(_grid);
            var containerElement = document.createElement('div');
            var _svgString = '';
            var tmpWidth = TILE_SPACE;
            var tmpHeight = TILE_SPACE;

            containerElement.setAttribute('id', 'image-container');

            if(_grid) {

                for(var row=0; row<_grid.length; row++) {
                    tmpWidth = TILE_SPACE;
                    for(var cellIndex=0; cellIndex<localGrid[row].length; cellIndex++) {
                        if(localGrid[row][cellIndex].active) {

                            // Getting the SVG as String
                            _svgString= processXML(localGrid[row][cellIndex].tile);

                            var tileId = localGrid[row][cellIndex].id;
                            var SVGContainer = document.createElement('div');

                            SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                            SVGContainer.setAttribute('class', 'svg-tile');
                            SVGContainer.innerHTML = _svgString;

                            var html = SVGContainer.querySelector('svg');
                            html.setAttribute('version', '1.1');
                            html.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                            var rotation = 'rotate(' + _grid[row][cellIndex].tile.custom_styles.rotation + 'deg)'
                            var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html.outerHTML);
                            var img = '<img src="' + imgsrc + '" style="position: absolute; width: ' + tileWidth + 'px; height: ' + tileHeight + 'px; left: ' + tmpWidth +'px; top: ' + tmpHeight + 'px; transform: ' + rotation + '" >';

                            containerElement.innerHTML+= img;
                            tmpWidth+= tileWidth + TILE_SPACE;
                        }
                    }
                    tmpHeight+= tileHeight + TILE_SPACE;
                }

                var images = containerElement.querySelectorAll('img');
                var maxHeight = 0;
                var maxWidth = 0;
                for(var imageIndex=0; imageIndex<images.length; imageIndex++) {
                    var tmpImage = images[imageIndex];

                    if (tmpImage.offsetTop > maxHeight) {
                        maxHeight = image.offsetTop + tileHeight;
                    }

                    if(tmpImage.offsetLeft > maxWidth) {
                        maxWidth = tmpImage.offsetLeft + tileWidth;
                    }
                }
                containerElement.setAttribute('style', 'width: ' + maxWidth + 'px; height: ' + maxHeight + 'px;');

                return containerElement.innerHTML;
            }

            return '';

        }

        var refreshGrid = function() {
            _grid = summaryService.getGrid();
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.getRowStyle = function (row) {
            var _rowStyle = {
                'height': '0px',
                'width': '100%'
            };

            for(var i=0; i<row.length; i++){
                if(row[i].active){
                    _rowStyle.height = (100/collectionGrids.getSelectedGridType().cols) + '%';
                    break;
                }
            }

            return _rowStyle;
        };

        ctrl.getCellStyle = function () {

            if(collectionGrids.getSelectedGridType()){
                _cellStyle = {
                    'height': '100%',
                    'width': (100/collectionGrids.getSelectedGridType().cols)+'%',
                    'vertical-align': 'top'
                };
            }

            return _cellStyle;
        };

        var refreshTileDetails = function() {
            _tileDetails = summaryService.getTileDetails();
        };

        ctrl.exportAsPDF = function () {
            // Wrapper element
            var html2pdfTemplate = document.createElement('div');
            html2pdfTemplate.setAttribute('class', 'html2pdfTemplate');
            html2pdfTemplate.setAttribute('style', 'width: 100%; box-sizing: border-box; padding: 0; margin: 0; z-index: 0;');

            // Tile and color list
            var listElement = angular.copy(document.getElementById('tile-list'));
            var actionsElement = listElement.querySelector('.dialog-actions');
            listElement.removeChild(actionsElement);

            // Adds the grid as DOM element
            $timeout(function () {
                var bodyContainer = document.createElement('div');
                bodyContainer.setAttribute('style', 'margin: 0; padding: 16px; background: white; height: 100%;');
                bodyContainer.innerHTML =
                    '<h1 style="color: white; background: #8BC34A; padding: 4px 16px; font-size: 20px; font-weight: normal; margin: 16px 0;">Mi proyecto</h1>' +
                    '<div id="summary-body" style="padding: 0; margin: 16px 0 32px;">' +
                        '<p style="color: #424242; margin: 16px 0; font-size: 16px;">This is a summary of your design: </p>' +
                    '</div>';

                var gridElement = ctrl.getGridAsImage();
                gridElement.setAttribute('style', 'display: inline-block; position: relative; min-width: 210px; min-height: 210px; left: 0;');
                bodyContainer.querySelector('#summary-body').appendChild(gridElement);

                var listContainer = document.createElement('div');
                listContainer.setAttribute('style', 'display: block; width: 100%; margin: 0;');
                listContainer.innerHTML = listElement.innerHTML;

                var ulElement = listContainer.querySelector('ul');
                ulElement.setAttribute('style', 'padding: 0; list-style: none;')

                var liItems = ulElement.querySelectorAll('li');
                for(var liIndex=0; liIndex<liItems.length; liIndex++) {

                    var liItem = liItems[liIndex];
                    liItem.setAttribute('style', 'display: block;');

                    var tileButtonElement = liItem.querySelector('.tile');
                    tileButtonElement.setAttribute('style', 'display: inline-block; border: 1px solid #EEEEEE; width: 60px; height: 60px; margin-right: 8px;');

                    var tileInfo = liItem.querySelector('.info');
                    tileInfo.setAttribute('style', 'display: inline-block; width: 75%;');

                    var colorItems = liItem.querySelectorAll('.color');
                    var titleItems = liItem.querySelectorAll('.color-name');
                    var countItem = liItem.querySelector('.count');
                    countItem.setAttribute('style', 'display: inline-block; width: 15%; margin-right:');

                    for(var colorIndex=0; colorIndex<colorItems.length; colorIndex++) {
                        var colorItem = colorItems[colorIndex];
                        var titleItem = titleItems[colorIndex];
                        colorItem.setAttribute('style', 'border-radius: 50%; background:' + titleItem.innerHTML + '; display: inline-block; cursor: pointer; margin-top: 2px; position: relative; height: 30px;width: 30px;');
                        titleItem.setAttribute('style', 'color: #757575; display: block; font-size: 0.5rem;');
                    }
                }

                bodyContainer.appendChild(listContainer);
                html2pdfTemplate.appendChild(bodyContainer);

                //document.body.innerHTML = html2pdfTemplate.outerHTML;
                summaryService.convert2Pdf(html2pdfTemplate.outerHTML);
            }, 0);

        };

        ctrl.getGridAsImage = function () {
            var gridElement = document.createElement('div');
            gridElement.setAttribute('class', 'grid-element');
            gridElement.innerHTML = createPreview();

            return gridElement;
        };

        ctrl.getTileDetails = function() {
            return _tileDetails;
        };

        ctrl.getColor = function(hexValue){
            var color = summaryService.getColorByHexValue(hexValue);
            if(color) {
                if((color.hex_value).toLowerCase() == '#ffffff'){
                    color.style = {
                        'background-color': color.hex_value,
                        'border': '1px solid #212121'
                    };
                }
                color.style = {
                    'background-color': color.hex_value
                };
            }

            return color;
        };

        ctrl.getColorTitle = function(hexValue) {
            var color = summaryService.getColorByHexValue(hexValue);
            return (color)? color.title: '';
        };

        /**
         *
         */
        ctrl.completeStep = function() {
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[2].data);
        };

        ctrl.prevStep = function ($event) {
            ctrl.customizerCtrl.moveToPreviousStep();
        };

        ctrl.$onInit = function() {

        };

    }

    angular
        .module('summaryComponent')
        .component('summaryComponent', {
            templateUrl: 'components/summary/summary.template.html',
            controller: summaryController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);