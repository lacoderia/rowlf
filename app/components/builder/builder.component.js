(function(angular) {
    'use strict';

    function builderController($mdPanel, $mdDialog, $mdToast, $location, $window, $scope, $rootScope, collectionGrids, collectionTilesService, builderService, summaryService, projectService) {

        var ctrl = this;
        var _selectedTiles = [];
        var _tmpSelectedTiles = [];
        var _selectedTile;
        var _tmpTile;
        var _selectedCollectionTiles = [];
        var _gridTypes;
        var _grid = [];
        var _tileDetails = [];
        var _cellStyle;
        var _selectedCell;
        var _mdPanel = undefined;
        var _colors = [];
        var _projects = undefined;
        var _selectedImage = undefined;

        ctrl.EXAMPLE_IMAGES = [
            { 
                code: 'bathroom-1', 
                title: 'Bathroom 1', 
                url: '/assets/images/preview/bathroom_1.png',
                top: '35%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '101deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'bathroom-2', 
                title: 'Bathroom 2', 
                url: '/assets/images/preview/bathroom_2.png',
                top: '27%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '101deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'bedroom-1', 
                title: 'Bedroom', 
                url: '/assets/images/preview/bedroom_1.png',
                top: '29%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '101deg',
                translate: '8%, 0%',
                width: '100%',
            },
            { 
                code: 'kitchen-1', 
                title: 'Kitchen 1', 
                url: '/assets/images/preview/kitchen_1.png',
                top: '0%',
                perspective: '0px',
                perspectiveOrigin: '50% 50%',
                bgSizeMultiplier: 10,
                transformX: '0deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'kitchen-2', 
                title: 'Kitchen 2', 
                url: '/assets/images/preview/kitchen_2.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '104deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'entry-1', 
                title: 'Entry', 
                url: '/assets/images/preview/entry_1.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '104deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'dining-1', 
                title: 'Dining room', 
                url: '/assets/images/preview/dining_1.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '104deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'living-room-1', 
                title: 'Living Room', 
                url: '/assets/images/preview/living_room_1.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '104deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'laundry-1', 
                title: 'Laundry Room', 
                url: '/assets/images/preview/laundry_room_1.png',
                top: '30%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '105deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'outdoor-1', 
                title: 'Outdoor', 
                url: '/assets/images/preview/outdoor_1.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '105deg',
                translate: '0%, 0%',
                width: '100%',
            },
            { 
                code: 'office-1', 
                title: 'Office', 
                url: '/assets/images/preview/office_1.png',
                top: '25%',
                perspective: '30vw',
                perspectiveOrigin: '50% 0%',
                bgSizeMultiplier: 8,
                transformX: '104deg',
                translate: '0%, 0%',
                width: '100%',
            },

        ];
        ctrl.ACTIONS = {
            'EDIT': {code: 'EDIT'},
            'SAVE': {code: 'SAVE'},
            'DELETE': {code: 'DELETE'}
        };
        ctrl.GRID_ACTIONS = {
            'ROTATE': {code: 'ROTATE'},
            'DELETE': {code: 'DELETE'}
        };
        ctrl.selectedGridType = undefined;
        ctrl.selectedColor = undefined;
        ctrl.tileQuery = '';
        ctrl.projectQuery = '';
        ctrl.loading = false;

        ctrl.tableQuery = {
            order: 'createdAt',
          };

        $scope.$on('openProjectsView', function(){
            ctrl.openProjectsView();
        });

        ctrl.callAction = function ($event, action, tile) {
            $event.preventDefault();
            $event.stopPropagation();

            switch (action){
                case ctrl.ACTIONS['EDIT'].code:
                    if(tile) {
                        ctrl.openCustomizer(tile)
                    }
                    break;
                case ctrl.ACTIONS['DELETE'].code:
                    if(_selectedTile){
                        ctrl.deleteTile();
                    }
                    break;
                case ctrl.ACTIONS['SAVE'].code:
                    ctrl.saveCustomizer();
                    break;
            }
        };

        ctrl.callGridAction = function($event, action) {
            $event.preventDefault();
            $event.stopPropagation();

            switch (action){
                case ctrl.GRID_ACTIONS['ROTATE'].code:
                    if(_selectedCell){
                        $rootScope.$broadcast('rotateTile', _selectedCell.id);
                    }
                    break;
                case ctrl.GRID_ACTIONS['DELETE'].code:
                    if(_selectedCell){
                        _selectedCell.tile = undefined;
                        _selectedCell = undefined;
                    }
                    // Refresh tile details
                    refreshTileDetails();
                    break;
            }
        };

        ctrl.getSelectedImage = function () {
            return _selectedImage;
        };

        ctrl.setSelectedImage = function (image) {
            _selectedImage = image;
            $rootScope.$broadcast('imageChanged', _selectedImage);
        };

        ctrl.isImageSelected = function (image) {
            return (_selectedImage == image);
        };

        ctrl.getColors = function(){
            return _colors;
        };

        ctrl.getBucketIconStyle = function () {
            return {
                'color': ctrl.selectedColor.hex_value
            }
        };

        ctrl.getColorStyle = function(color){
            if((color.hex_value).toLowerCase() == '#ffffff'){
                return {
                    'background-color': color.hex_value,
                    'border': '1px solid #212121'
                }
            }
            return {
                'background-color': color.hex_value
            }
        };

        ctrl.setColor = function(indexColor){
            ctrl.selectedColor = indexColor;
        };

        ctrl.getSelectedColor = function () {
            return ctrl.selectedColor;
        };

        ctrl.isSelectedColor = function (color) {
            return (ctrl.selectedColor == color);
        };

        $scope.$on('selectedTilesChange', function(){
            refreshSelectedTiles();
        });

        var refreshSelectedTiles = function() {
            _selectedTiles = collectionTilesService.getSelectedTiles();
        };

        $scope.$on('selectedCollectionTilesChange', function(){
            ctrl.refreshSelectedCollectionTiles();
        });

        ctrl.refreshSelectedCollectionTiles = function() {
            _selectedCollectionTiles = collectionTilesService.getSelectedCollectionTiles();
        };

        /**
         *
         */
        ctrl.getTmpSelectedTiles = function() {
            return _tmpSelectedTiles;
        };

        /**
         *
         * @param tile
         */
        ctrl.addTile = function(tile) {
            var tmpTile = angular.copy(tile);
            tmpTile.tmpId = collectionTilesService.getTileCount();
            _tmpSelectedTiles.push(tmpTile);
        };

        /**
         *
         */
        ctrl.openAddTile = function() {
            _tmpSelectedTiles = angular.copy(_selectedTiles);

            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: function(){
                    return ctrl;
                },
                controllerAs: '$ctrl',
                disableParentScroll: false,
                templateUrl: 'components/builder/add-tile.template.html',
                hasBackdrop: true,
                panelClass: 'tile-customizer',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: false,
                escapeToClose: true,
                focusOnOpen: true
            };
            _mdPanel = $mdPanel.create(config);
            _mdPanel.open();
        };

        ctrl.closeAddTile = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                _tmpSelectedTiles = [];
            });
        };

        ctrl.saveAddTile = function() {
            _selectedTiles = angular.copy(_tmpSelectedTiles);
            ctrl.closeAddTile();
        };

        ctrl.deleteTile = function() {
            for(var i=0; i<_selectedTiles.length; i++) {
                if(_selectedTiles[i].tmpId == _selectedTile.tmpId) {
                    _selectedTiles.splice(i, 1);
                    _selectedTile = undefined;
                    break;
                }
            }
        };

        /**
         *
         * @returns {*}
         */
        ctrl.rotateTile = function () {
            if(_selectedTile){
                $rootScope.$broadcast('');
            }
        };

        ctrl.getSelectedTile = function () {
            return _selectedTile;
        };

        ctrl.selectTile = function ($event, tile) {
            if(ctrl.isSelectedTile(tile)){
                _selectedTile = undefined;
            }else{
                _selectedTile = tile;
            }
        };

        ctrl.isSelectedTile = function (tile) {
            if(_selectedTile){
                return (_selectedTile.tmpId == tile.tmpId);
            }
            return false;
        };

        ctrl.getSelectedCollectionTiles = function() {
            return _selectedCollectionTiles;
        };

        ctrl.getSelectedCollectionSize = function() {
            return collectionGrids.getSelectedCollectionSize();
        };

        ctrl.getGridTypes = function () {
            return _gridTypes;
        };

        ctrl.getSelectedTiles = function () {
            return _selectedTiles;
        };

        ctrl.getSelectedGridSize = function () {
            return collectionGrids.getSelectedGridSize();
        };

        ctrl.isHexagonalGrid = function() {
            return collectionGrids.isHexagonalGrid();
        };

        ctrl.setSelectedGridType = function (gridType) {
            ctrl.selectedGridType = gridType;
            collectionGrids.setSelectedGridType(gridType);

            // deactivate all tiles
            for(var rowIndex=0; rowIndex<_grid.length; rowIndex++){
                for(var colIndex=0; colIndex<_grid[rowIndex].length; colIndex++){
                    _grid[rowIndex][colIndex].active = false;
                }
            }

            // activate selected grid's tiles
            for(var rowIndex=0; rowIndex<gridType.rows; rowIndex++){
                for(var colIndex=0; colIndex<gridType.cols; colIndex++){
                    _grid[rowIndex][colIndex].active = true;
                }
            }

            // delete unwanted tiles
            for(var rowIndex=0; rowIndex<_grid.length; rowIndex++){
                for(var colIndex=0; colIndex<_grid[rowIndex].length; colIndex++){
                    if(_grid[rowIndex][colIndex].active == false) {
                        _grid[rowIndex][colIndex].tile = undefined;
                    }
                }
            }

            // Refresh tile details
            refreshTileDetails();
        };

        ctrl.getGrid = function () {
            return _grid;
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

            return _cellStyle = {
                'height': '100%',
                'width': (100/collectionGrids.getSelectedGridSize())+'%',
                'vertical-align': 'top'
            };
        };

        ctrl.selectCell = function(cell) {
            if(cell.tile){
                if(!_selectedCell){
                    _selectedCell = cell;
                }else{
                    _selectedCell = undefined;
                }
            }else{
                _selectedCell = undefined;
                ctrl.copyTileToGrid(cell);
            }
        };

        ctrl.isSelectedCell = function(cellId) {
            return (_selectedCell)? (_selectedCell.id == cellId): false;
        };

        ctrl.copyTileToGrid = function(cell) {

            if(_selectedTile) {
                for(var i=0; i<_grid.length; i++) {
                    for(var j=0; j<_grid[i].length; j++) {
                        if(_grid[i][j].id == cell.id) {
                            cell.tile = angular.copy(_selectedTile);
                            _grid[i][j] = angular.copy(cell);

                            // Refresh tile details
                            refreshTileDetails();

                            return;
                        }
                    }
                }
            }

            
        };

        function getTileIndex(tile) {
            var index = -1;
            var tmpCustomStyles;
            for(var k=0; k<_tileDetails.length; k++) {
                tmpCustomStyles = _tileDetails[k].custom_styles;
                if(tmpCustomStyles && tile.custom_styles && JSON.stringify(tmpCustomStyles.path_styles) == JSON.stringify(tile.custom_styles.path_styles)){
                    index = k;
                    return index;
                }
            }

            return index;
        }

        var refreshTileDetails = function() {
            _tileDetails = [];
            var index;

            for(var i=0; i<_grid.length; i++) {
                for(var j=0; j<_grid[i].length; j++) {
                    if(_grid[i][j].tile){
                        index = getTileIndex(_grid[i][j].tile);
                        if( index == -1){
                            _tileDetails.push(_grid[i][j].tile);
                        }
                    }
                }
            }
        }

        ctrl.getTileDetails = function() {
            return _tileDetails;
        };

        /**
         *
         */
        ctrl.getTmpTile = function() {
            return _tmpTile;
        };

        /**
         *
         * @param tile
         */
        ctrl.openCustomizer = function(tile) {
            _tmpTile = angular.copy(tile);

            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: function(){
                    return ctrl;
                },
                controllerAs: '$ctrl',
                disableParentScroll: false,
                templateUrl: 'components/builder/panel.template.html',
                hasBackdrop: true,
                panelClass: 'tile-customizer',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: false,
                escapeToClose: true,
                focusOnOpen: true
            };
            _mdPanel = $mdPanel.create(config);
            _mdPanel.open();
        };

        /**
         *
         */
        ctrl.isPreviewReady = function() {
            for(var rowIndex=0; rowIndex<_grid.length; rowIndex++){
                for(var colIndex=0; colIndex<_grid[rowIndex].length; colIndex++){

                    if(_grid[rowIndex][colIndex].active && _grid[rowIndex][colIndex].tile === undefined) {
                        return false;
                    }
                }
            }

            return true;
        };

        /**
         *
         * @param tile
         */
        ctrl.openPreview = function(tile) {
            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: function(){
                    return ctrl;
                },
                controllerAs: '$ctrl',
                disableParentScroll: false,
                templateUrl: 'components/builder/preview.template.html',
                hasBackdrop: true,
                panelClass: 'tile-customizer',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: false,
                escapeToClose: true,
                focusOnOpen: true
            };
            _mdPanel = $mdPanel.create(config);
            _mdPanel.open();
        };

        ctrl.showFirefoxNotice = function() {
            return navigator.userAgent.indexOf("Firefox") !== -1 ? true : false;
        }

        ctrl.savePreview = function() {

            domtoimage.toJpeg(document.getElementById('preview-to-pdf'), { 
                height: document.getElementById('preview-to-pdf').clientHeight, 
                width: document.getElementById('preview-to-pdf').clientWidth 
            })
                .then(function (dataUrl) {
                    var link = document.createElement('a');
                    link.download = 'preview.jpeg';
                    link.href = dataUrl;
                    link.click();

                    // var docDefinition = {
                    //     content: [{
                    //         image: dataUrl,
                    //         width: 500,
                    //     }]
                    // };
                    // pdfMake.createPdf(docDefinition).download("preview.pdf");
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });

        };

        ctrl.closePreview = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                ctrl.setSelectedImage(undefined);
            });
        };

        ctrl.closeCustomizer = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
                _tmpTile = undefined;
            });
        };

        ctrl.saveCustomizer = function() {

            for(var i=0; i<_selectedTiles.length; i++){
                if(_selectedTiles[i].tmpId == _selectedTile.tmpId){
                    _selectedTiles[i] = angular.copy(_tmpTile);
                    _selectedTile = _tmpTile;
                }
            }
            ctrl.closeCustomizer();
        };

        /**
         *
         * @param tile
         */
        ctrl.openProjectsView = function() {

            var position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            var config = {
                attachTo: angular.element(document.body),
                controller: function(){
                    return ctrl;
                },
                controllerAs: '$ctrl',
                disableParentScroll: false,
                templateUrl: 'components/builder/projects.template.html',
                hasBackdrop: true,
                panelClass: 'projects-view',
                position: position,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: false,
                escapeToClose: true,
                focusOnOpen: true
            };

            _mdPanel = $mdPanel.create(config);
            _mdPanel.open();

            _projects = undefined;
            ctrl.loading = true;
            projectService.callProjects()
                .then(function(data) {
                    if(data.projects){
                        _projects = projectService.getProjects();
                    }
                    ctrl.loading = false;
                }, function(error) {
                    if(error && error.errors){
                        console.log(error.errors[0].title);
                    }

                    ctrl.loading = false;
                    ctrl.closeProjectsView();

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('An error ocurred while opening your designs!')
                            .position('top right')
                    );
                });

        };

        /**
         *
         */
        ctrl.closeProjectsView = function() {
            _mdPanel.close().then(function() {
                _mdPanel = undefined;
            });
        };

        ctrl.openProject = function(project){
            $window.open(project.url, "_blank");
        };

        ctrl.toggleProjectDetail = function($event, project) {
            $event.preventDefault();
            $event.stopPropagation();

            project.showDetailView = !project.showDetailView;
        };

        ctrl.showEmailView = function($event, project) {
            $event.preventDefault();
            $event.stopPropagation();

            for(var i=0; i<_projects.length; i++) {
                _projects[i].email = '',
                _projects[i].showEmailView = false;
            }

            project.email = '';
            project.showEmailView = true;
        };

        ctrl.hideEmailView = function($event, project) {
            $event.preventDefault();
            $event.stopPropagation();

            project.showEmailView = false;
        };

        ctrl.sendProject = function($event, project) {
            $event.preventDefault();
            $event.stopPropagation();

            ctrl.emailForm.$submitted = true;

            if(ctrl.emailForm.$valid) {

                project.sending = true;
                projectService.sendProject(project.id, project.email).then(
                    function (response) {
                        project.sending = false;
                        project.showEmailView = false;

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Your design was successfully sent!')
                                .position('top right')
                        );
                    },
                    function (error) {
                        console.log(error);

                        project.sending = false;
                        ctrl.closeProjectsView();

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('An error occurred, please try again later.')
                                .position('top right')
                        );
                    }
                );
            }

        };

        ctrl.deleteProject = function ($event, project) {
            $event.preventDefault();
            $event.stopPropagation();

            project.deleting = true;

            projectService.deleteProject(project.id).then(
                function (response) {

                    projectService.deleteFile(project).then(
                        function (response) {
                            projectService.deleteProjectById(_projects, project.id);
                            project.deleting = false;
                        },
                        function (error) {
                            console.log(error);

                            project.deleting = false;
                            ctrl.closeProjectsView();

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

                    project.deleting = false;
                    ctrl.closeProjectsView();

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('An error occurred, please try again later.')
                            .position('top right')
                    );
                }
            );
        };

        ctrl.getUserProjects = function() {
            return _projects;
        };

        ctrl.searchProject = function(item) {
            if (!ctrl.projectQuery || (item.name.toLowerCase().indexOf(ctrl.projectQuery.toLowerCase()) != -1) || (item.description.toLowerCase().indexOf(ctrl.projectQuery.toLowerCase()) != -1) ){
                return true;
            }

            for (var i=0; i<item.tiles.length; i++) {
                if ( (item.tiles[i].name.toLowerCase().indexOf(ctrl.projectQuery.toLowerCase()) != -1) || item.tiles[i].sku && (item.tiles[i].sku.toLowerCase().indexOf(ctrl.projectQuery.toLowerCase()) != -1) ) {
                    return true;
                }
            }
            return false;
        }

        /**
         *
         */
        ctrl.completeStep = function() {
            summaryService.setSummary(_grid);
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[1].data);
        };

        /**
         *
         */
        ctrl.startOver = function($event) {

            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                template:
                '<md-dialog aria-label="Previous step" class="start-over-dialog">' +
                '  <md-dialog-content class="md-dialog-content">'+
                '    <h2 class="md-title">Do you want to go back to the previous step?</h2>' +
                '    <div class="md-dialog-content-body">' +
                '      <p>All your changes will be lost, and you will have to start over again</p>' +
                '    </div>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="$ctrl.resetBuilder()">' +
                '      Yes, take me back!' +
                '    </md-button>' +
                '    <md-button ng-click="$ctrl.closeDialog()" class="md-primary">' +
                '      No, keep me here' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                scope: $scope,
                preserveScope: true
            });

        };

        ctrl.closeDialog = function() {
            $mdDialog.hide();
        };

        ctrl.resetBuilder = function() {
            $location.path('/');
        };

        /**
         *
         * @returns {boolean}
         */
        ctrl.isDisabled = function() {
            var disabled = true;

            for(var i=0; i<_grid.length; i++){
                for(var j=0; j<_grid.length; j++){
                    if(_grid[i][j].tile){
                        disabled = false;
                        break;
                    }
                }
            }

            return disabled;
        };

        ctrl.$onInit = function() {
            _gridTypes = collectionGrids.getCollectionGrids();
            if(!_colors.length > 0){
                _colors = builderService.callColors().then(
                    function () {
                        _colors = builderService.getColors();
                        if(_colors.length > 0){
                            ctrl.setColor(_colors[0]);
                        }
                    }
                );
            }

            var maxCols = 0;
            var maxRows = 0;

            for(var gridIndex=0; gridIndex<_gridTypes.length; gridIndex++){
                var gridType = _gridTypes[gridIndex];
                maxCols = (maxCols <= gridType.cols)? gridType.cols : maxCols;
                maxRows = (maxRows <= gridType.rows)? gridType.rows : maxRows;
            }

            var cellId = 0;
            for(var rowIndex=0; rowIndex<maxRows; rowIndex++){
                _grid[rowIndex] = [];
                for(var colIndex=0; colIndex<maxCols; colIndex++){
                    _grid[rowIndex][colIndex] = {
                        id: cellId,
                        active: false,
                        tile: undefined
                    };
                    cellId++;
                }
            }

            if(_gridTypes.length > 0){
                ctrl.setSelectedGridType(_gridTypes[0]);
            }

            // Show notification if user agent is not Chrome

            var isChromium = window.chrome;
            var winNav = window.navigator;
            var vendorName = winNav.vendor;
            var isOpera = typeof window.opr !== "undefined";
            var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
            var isIOSChrome = winNav.userAgent.match("CriOS");

            if (isIOSChrome) {
            // is Google Chrome on IOS
            } else if(
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
            ) {
            // is Google Chrome
            } else { 
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('To ensure a better experience please use Chrome browser.')
                        .position('top right')
                        .hideDelay(10000)
                        .action('CLOSE')
                );
            }

        };
    }

    angular
        .module('builder')
        .component('builder', {
            templateUrl: 'components/builder/builder.template.html',
            controller: builderController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);