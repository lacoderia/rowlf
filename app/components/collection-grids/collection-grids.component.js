(function(angular) {
    'use strict';

    function collectionGridsController($scope, collectionGrids) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;

        /**
         *
         * @type {Array}
         * @private
         */
        var _grids = [];

        /**
         *
         * @returns {Array}
         */
        ctrl.getCollectionGrids = function() {
            return _grids;
        };

        /**
         *
         * @param collectionId
         */
        ctrl.selectCollectionGrids = function(collectionId) {
            collectionGrids.setSelectedCollectionGrids(collectionId);
        };

        /**
         *
         */
        ctrl.completeStep = function() {
            ctrl.customizerCtrl.submitCurrentStep(ctrl.customizerCtrl.stepData[1].data);
        };


        /**
         *
         */
        ctrl.init = function() {
            _grids = collectionGrids.getCollectionGrids();
        };

    }

    angular
        .module('collectionGrids')
        .component('collectionGrids', {
            templateUrl: 'components/collection-grids/collection-grids.template.html',
            controller: collectionGridsController,
            bindings: {

            },
            require: {
                customizerCtrl: '^customizer'
            }
        });

})(window.angular);