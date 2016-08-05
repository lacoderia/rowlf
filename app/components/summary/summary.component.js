(function(angular) {
    'use strict';

    function summaryController($scope, summaryService, collectionGrids) {

        var ctrl = this;
        var _grid = [];
        var _rowStyle;
        var _cellStyle;
        var _tileDetails = [];

        $scope.$on('summaryChange', function(){
            refreshGrid();
            refreshTileDetails();
        });

        var refreshGrid = function() {
            _grid = summaryService.getGrid();
        };

        ctrl.getGrid = function () {
            return _grid;
        };

        ctrl.getRowStyle = function () {

            if(collectionGrids.getSelectedGridType()){
                _rowStyle = {
                    'height': (100/collectionGrids.getSelectedGridType().cols)+'%',
                    'width': '100%'
                };
            }

            return _rowStyle
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

        ctrl.getTileDetails = function() {
            return _tileDetails;
        };

        /**
         *
         */
        ctrl.completeStep = function() {
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[3].data);
        };

        ctrl.$onInit = function() {

        };

    }

    angular
        .module('summary')
        .component('summary', {
            templateUrl: 'components/summary/summary.template.html',
            controller: summaryController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);