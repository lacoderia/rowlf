(function(angular) {
    'use strict';

    function summaryController($rootScope, $scope, $mdDialog, $mdToast, $timeout, $q, $window, sessionService, summaryService, projectService, collectionGrids) {

        var PROJECT_NAME = 'MyDesign';
        var ctrl = this;
        var _grid = [];
        var _cellStyle;
        var _tileDetails = [];

        ctrl.loading = false;

        $scope.$on('summaryChange', function(){
            refreshGrid();
            refreshTileDetails();
        });

        function processXML(tileData, tileWidth, tileHeight) {

            if(tileData){
                if(tileData.xml) {
                    var parser = new DOMParser();
                    var svg = parser.parseFromString(tileData.xml, "application/xml");
                    var SVGTypes = {
                        'path': svg.getElementsByTagName('path'),
                        'polygons': svg.getElementsByTagName('polygon'),
                        'rect': svg.getElementsByTagName('rect'),
                        'polylines': svg.getElementsByTagName('polyline'),
                        'circle': svg.getElementsByTagName('circle'),
                        'ellipses': svg.getElementsByTagName('ellipse')
                    };
                    var SVGTypesKeys = Object.keys(SVGTypes);
                    for(var typeIndex=0; typeIndex<SVGTypesKeys.length; typeIndex++) {
                        var SVGType = SVGTypesKeys[typeIndex];
                        var SVGArray = SVGTypes[SVGType];

                        for(var elementIndex=0; elementIndex<SVGArray.length; elementIndex++){
                            var element = SVGArray[elementIndex];
                            if(element.id){
                                if(tileData.custom_styles.path_styles[element.id]) {
                                    var pathStyle = tileData.custom_styles.path_styles[element.id];
                                    element.style.fill = pathStyle.fill;
                                    element.style.stroke = pathStyle.stroke;
                                }
                            }
                        }
                    }


                    return new XMLSerializer().serializeToString(svg);
                }
            }

            var SVGObject = document.createElement('svg');
            var GObject = document.createElement('g');

            d3.select(GObject)
                .attr('width', tileWidth)
                .attr('height', tileHeight)
                .attr('transform-origin', 'right bottom')
                .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', tileWidth)
                    .attr('height', tileHeight)
                    .attr('fill', '#FFFFFF')
                    .attr('stroke', '#E5E5E5');

            SVGObject.appendChild(GObject);

            return SVGObject.outerHTML;
        }

        function createImage(url, imageOptions, ctx) {
            return $q(function (resolve, reject) {
                var TO_RADIANS = Math.PI/180;
                var image = new Image();
                image.setAttribute('style', 'width: ' + imageOptions.width + 'px; height: ' + imageOptions.height + 'px;');
                image.onload = function() {
                    ctx.save();
                    ctx.translate((imageOptions.x + (imageOptions.width/2)), imageOptions.y + (imageOptions.height/2));
                    ctx.rotate(imageOptions.degrees * TO_RADIANS);
                    ctx.drawImage(this, -(imageOptions.width/2), -(imageOptions.height/2), imageOptions.width, imageOptions.height);
                    ctx.restore();
                    resolve();
                };
                image.src = url;
            });

        }

        function createPreview() {
            return $q(function (resolve, reject) {
                var TILE_SPACE = 1;
                var tileWidth = 100;
                var tileHeight = 100;
                var localGrid = angular.copy(_grid);
                var containerElement = document.createElement('div');
                var _svgString = '';
                var tmpWidth = TILE_SPACE;
                var tmpHeight = TILE_SPACE;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d');
                var images = [];

                // hexagon numbers
                var hexSide = (tileWidth/2) * 1.15;
                if(ctrl.isHexagonalGrid()){
                    tileHeight = hexSide * 2;
                }

                containerElement.setAttribute('id', 'image-container');

                if(_grid) {

                    for(var row=0; row<_grid.length; row++) {
                        tmpWidth = TILE_SPACE;
                        if(ctrl.isHexagonalGrid() && (row % 2 != 0) ){   // is hex and row is even
                            tmpWidth += (tileWidth/2);
                        }
                        for(var cellIndex=0; cellIndex<localGrid[row].length; cellIndex++) {
                            if(localGrid[row][cellIndex].active) {

                                // Getting the SVG as String
                                _svgString= processXML(localGrid[row][cellIndex].tile, tileWidth, tileHeight);

                                var tileId = localGrid[row][cellIndex].id;
                                var SVGContainer = document.createElement('div');

                                SVGContainer.setAttribute('id', 'tile-element-' + tileId + '');
                                SVGContainer.setAttribute('class', 'svg-tile');
                                SVGContainer.innerHTML = _svgString;

                                var svg = SVGContainer.querySelector('svg');
                                svg.setAttribute('version', '1.1');
                                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                                var degrees = '0';
                                if (_grid[row][cellIndex].tile) {
                                    degrees = _grid[row][cellIndex].tile.custom_styles.rotation;
                                }

                                //var img = '<img src="' + imgsrc + '" style="position: absolute; width: ' + tileWidth + 'px; height: ' + tileHeight + 'px; left: ' + tmpWidth +'px; top: ' + tmpHeight + 'px; transform: ' + rotation + ';" >';
                                var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svg.outerHTML);
                                var imageOptions = {
                                    x: tmpWidth,
                                    y: tmpHeight,
                                    width: tileWidth,
                                    height: tileHeight,
                                    degrees: degrees,
                                    url: imgsrc
                                };

                                images.push(createImage(imgsrc, imageOptions, ctx));
                                tmpWidth += tileWidth + TILE_SPACE;
                            }
                        }
                        if(ctrl.isHexagonalGrid()){   // is hex
                            tmpHeight += (hexSide * 1.5);
                        } else {
                            tmpHeight += tileHeight + TILE_SPACE;
                        }
                    }

                    var factor = Math.floor((images.length)/collectionGrids.getSelectedGridSize());
                    var canvasWidth = (tileWidth * factor) + (TILE_SPACE * factor) + TILE_SPACE;
                    if(ctrl.isHexagonalGrid()){
                        canvasWidth += (tileWidth/2);
                    }
                    var canvasHeight = (tileHeight * factor) + (TILE_SPACE * factor) + TILE_SPACE;

                    canvas.width  = canvasWidth;
                    canvas.height = canvasHeight;
                    canvas.style.width  = canvasWidth + 'px';
                    canvas.style.height = canvasHeight + 'px';

                    $q.all(images).then(function () {
                        var imageUrl = canvas.toDataURL("image/png");
                        var gridImage = document.createElement('img');
                        gridImage.onload = function () {
                            resolve(this);
                        };
                        gridImage.src = imageUrl;
                    });
                }

            });
        }

        var getGridAsImage = function () {
            return $q(function (resolve, reject) {
                var gridElement = document.createElement('div');
                gridElement.setAttribute('style', 'visibility: hidden');
                createPreview().then(
                    function (response) {
                        var gridImage = response;
                        gridImage.setAttribute('style', 'display: inline-block;');
                        gridElement.appendChild(gridImage);
                        var imageWidth = gridElement.querySelector('img').offsetWidth;
                        var imageHeight = gridElement.querySelector('img').offsetWidth;
                        gridElement.setAttribute('style', 'position: relative; width: ' + imageWidth + 'px; height: ' + imageHeight + 'px;');
                        resolve(gridElement);
                    }
                );
            });

        };

        var exportAsPDF = function (projectName) {
            return $q(function (resolve, reject) {
                // Wrapper element
                var html2pdfTemplate = document.createElement('div');
                html2pdfTemplate.setAttribute('class', 'html2pdfTemplate');
                html2pdfTemplate.setAttribute('style', 'width: 100%; box-sizing: border-box; padding: 0; margin: 0; z-index: 0;');

                // Adds the grid as DOM element
                $timeout(function () {
                    var bodyContainer = document.createElement('div');
                    bodyContainer.setAttribute('style', 'margin: 0; padding: 16px; background: white; height: 100%;');
                    bodyContainer.innerHTML =
                        '<h1 style="color: white; background: #8BC34A; padding: 4px 16px; font-size: 20px; font-weight: normal; margin: 16px 0;">Design Studio</h1>' +
                        '<div id="summary-body" style="padding: 0; margin: 16px 0 32px;">' +
                        '<p style="color: #424242; margin: 16px 0; font-size: 12px;">' + sessionService.get().getName().split(' ')[0] + ', this is a summary of your design: "' + projectName + '"</p>' +
                        '<p style="color: #424242; margin: 16px 0; font-size: 12px;">Preview: </p>' +
                        '</div>';

                    getGridAsImage().then(
                        function (response) {
                            var gridImage = response;

                            gridImage.setAttribute('style', 'text-align: center;');
                            bodyContainer.querySelector('#summary-body').appendChild(gridImage);

                            var listTitle = document.createElement('p');
                            listTitle.setAttribute('style', 'color: #424242; margin: 16px 0; font-size: 12px;');
                            listTitle.innerHTML = 'Tile details are shown on the following pages.';
                            bodyContainer.appendChild(listTitle);

                            // Tile and color list
                            var listContainer = document.createElement('div');
                            listContainer.setAttribute('style', 'display: block; width: 100%; margin: 0;');
                            listContainer.innerHTML = angular.copy(document.getElementById('tile-list')).innerHTML;

                            var tileRows = listContainer.querySelectorAll('.tile-row');

                            for(var i=0; i<tileRows.length; i++) {
                                var t = document.createElement('table');
                                t.setAttribute('style', 'width: 80%; margin: 0 auto; page-break-before: always;');

                                var tileColors = tileRows[i].querySelector('.tile-colors') ? angular.copy(tileRows[i].querySelector('.tile-colors')) : undefined;
                                var tileColorsInnerHTML = '';

                                if (tileColors) {
                                    var tileColorCells = tileColors.querySelectorAll('.color-item');
                                    for(var j=0; j<tileColorCells.length; j++) {
                                        tileColorCells[j].setAttribute('style', 'display: inline-block; width: 200px;');
                                    }

                                    var tileColorCells = tileColors.querySelectorAll('span.color');
                                    for(var j=0; j<tileColorCells.length; j++) {
                                        tileColorCells[j].setAttribute('style', tileColorCells[j].getAttribute('style') + 'height:20px; width: 20px; border: 1px solid #757575; border-radius: 50%; display: inline-block; position: relative;');
                                    }

                                    var tileColorCells = tileColors.querySelectorAll('span.color-name');
                                    for(var j=0; j<tileColorCells.length; j++) {
                                        tileColorCells[j].setAttribute('style', 'font-size: 12px; display: block;');
                                    }

                                    tileColorsInnerHTML = tileColors.innerHTML;
                                }

                                t.innerHTML ='' +
                                    '<tbody>' +
                                    '   <tr>' +
                                    '       <td align="center">' +
                                    '           <div style="width:400px; height:400px; margin-top:20px;">' +
                                                    tileRows[i].querySelector('.tile-cell').innerHTML +
                                    '           </div>' +
                                    '       </td>' +
                                    '   </tr>' +
                                    '   <tr>' +
                                    '       <td style="font-size:12px;" align="center">' +
                                                    tileRows[i].querySelector('.tile-count').innerHTML + ' x ' + tileRows[i].querySelector('.tile-name').innerHTML +
                                    '       </td>' +
                                    '   </tr>' +
                                    '   <tr>' +
                                    '       <td style="font-size:12px; padding-top:20px;">' +
                                                tileColorsInnerHTML +
                                    '       </td>' +
                                    '   </tr>' +
                                    '</tbody>';

                                bodyContainer.appendChild(t);
                            }

                            html2pdfTemplate.appendChild(bodyContainer);
                            resolve(html2pdfTemplate.outerHTML);
                        }
                    );

                }, 0);
            });

        };

        var refreshGrid = function() {
            _grid = summaryService.getGrid();
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.isHexagonalGrid = function() {
            return collectionGrids.isHexagonalGrid();
        };

        ctrl.getGridClasses = function () {
            var _gridClasses = {
                'hex-grid' : ctrl.isHexagonalGrid(),
                'grid-size-2': collectionGrids.getSelectedGridSize() == 2,
                'grid-size-5': collectionGrids.getSelectedGridSize() == 5
            };

            return _gridClasses;
        };

        ctrl.getRowStyle = function (row, index) {
            var _rowStyle = {
                'height': '0px',
                'width': '100%'
            };

            for(var i=0; i<row.length; i++){
                if(row[i].active){
                    if (ctrl.isHexagonalGrid()){
                        _rowStyle.height = 'auto';
                        if( index % 2 != 0 ) {
                            _rowStyle['margin-left'] = (50 / collectionGrids.getSelectedGridSize()) + '%';
                        }
                    } else {
                        _rowStyle.height = (100 / collectionGrids.getSelectedGridSize()) + '%';
                    }
                    break;
                }
            }

            return _rowStyle;
        };

        ctrl.getCellStyle = function () {

            if(collectionGrids.getSelectedGridType()){
                _cellStyle = {
                    'height': '100%',
                    'width': (100/collectionGrids.getSelectedGridSize())+'%',
                    'vertical-align': 'top'
                };
            }

            return _cellStyle;
        };

        var refreshTileDetails = function() {
            _tileDetails = summaryService.getTileDetails();
        };

        ctrl.promptSaveProject = function(event) {

            ctrl.projectName = '';

            $mdDialog.show({
                controller: summaryController,
                template: '' +
                '<md-dialog md-theme="default" aria-label="Save design" class="md-default-theme" ng-class="dialog.css" flex="20" ng-cloak>' +
                '   <md-dialog-content class="md-dialog-content" ng-if="$ctrl.loading">' +
                '       <div layout="row" flex="100">' +
                '           <div layout-align="center center" layout="column" flex="100">' +
                '               <md-progress-circular md-mode="indeterminate" md-diameter="50"></md-progress-circular>' +
                '           </div>' +
                '       </div>' +
                '   </md-dialog-content>' +

                '   <md-dialog-content class="md-dialog-content" ng-if="!$ctrl.loading">' + 
                '      <form novalidate class="form" name="$ctrl.saveDesignForm">' + 
                '           <h2 class="md-title">Save design</h2>' +
                '           <md-input-container class="md-default-theme">' + 
                '               <input name="projectName" ng-model="$ctrl.projectName" placeholder="Design name" ng-pattern="/^[0-9a-zA-Z ]+$/" required>' + 
                '               <div ng-messages="$ctrl.saveDesignForm.projectName.$error" md-auto-hide="false">' +
                '                   <div ng-message="required">You must enter a design name</div>' +
                '                   <div ng-message="pattern">Please enter a valid name.</div>' + 
                '               </div>' + 
                '           </md-input-container>' +
                '       </form>' +
                '   </md-dialog-content>' +

                '   <md-dialog-actions ng-if="!$ctrl.loading">' +
                '       <md-button ng-click="$ctrl.cancel()" class="md-default-theme md-primary">' +
                '           Cancel' +
                '       </md-button>' +
                '       <md-button ng-click="$ctrl.saveProject()" class="md-default-theme md-primary">' +
                '           Save' +
                '       </md-button>' +
                '   </md-dialog-actions>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,
                targetEvent: event,
                clickOutsideToClose:false
            });
        };

        /**
         *
         */
        ctrl.cancel = function() {
            $mdDialog.cancel();
        };

        ctrl.saveProject = function () {

            if(ctrl.saveDesignForm.$valid) {

                ctrl.loading = true;

                var projectName = (ctrl.projectName)? ctrl.projectName : PROJECT_NAME;
                exportAsPDF(projectName).then(
                    function (data) {
                        var htmlString = data;
                        summaryService.convert2Pdf(htmlString, projectName).then(
                            function (response) {
                                projectService.saveProject(response.name, response.filename, response.url).then(
                                    function (response) {
                                        var project = response.project;
                                        ctrl.loading = false;
                                        $mdDialog.hide();
                                        $window.open(project.url);
                                        $mdToast.show(
                                            $mdToast.simple()
                                                .textContent('Your design was successfully saved!')
                                                .position('top right')
                                        );

                                        $rootScope.$broadcast('openProjectsView');

                                    },
                                    function (error) {
                                        console.log(error);

                                        ctrl.loading = false;
                                        ctrl.cancel();

                                        $mdToast.show(
                                            $mdToast.simple()
                                                .textContent('An error occurred, please try again later.')
                                                .position('top right')
                                        );
                                    }
                                );
                            },
                            function (error) {
                                console.log(error);

                                ctrl.loading = false;
                                ctrl.cancel();

                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent('An error occurred, please try again later.')
                                        .position('top right')
                                );
                            }
                        );

                    },
                    function () {
                        console.log('Error saving the project');

                        ctrl.loading = false;
                        ctrl.cancel();

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('An error occurred, please try again later.')
                                .position('top right')
                        );
                    }
                );
            }
        };

        ctrl.getTileDetails = function() {
            for(var tileIndex=0; tileIndex<_tileDetails.length; tileIndex++) {
                var tile = _tileDetails[tileIndex];
                tile.proccessedColors = [];
                for(var colorIndex=0; colorIndex<tile.colors.length; colorIndex++) {
                    var hexValue = tile.colors[colorIndex];
                    var color = getColor(hexValue);
                    if(color) {
                        tile.proccessedColors.push(color);
                    }
                }
            }
            return _tileDetails;
        };

        var getColor = function(hexValue){
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