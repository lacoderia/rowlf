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

        ctrl.getColor = function(hexValue){
            var color = summaryService.getColorByHexValue(hexValue);
            if((color.hex_value).toLowerCase() == '#ffffff'){
                color.style = {
                    'background-color': color.hex_value,
                    'border': '1px solid #212121'
                };
            }
            color.style = {
                'background-color': color.hex_value
            };
            console.log(color);
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