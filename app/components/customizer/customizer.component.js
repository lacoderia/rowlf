(function(angular) {
    'use strict';

    function customizerController($q, $timeout) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;

        ctrl.selectedStep = 0;
        ctrl.stepProgress = 1;
        ctrl.maxStep = 3;
        ctrl.showBusyText = false;
        ctrl.stepData = [
            { step: 1, completed: false, optional: false, data: {} },
            { step: 2, completed: false, optional: false, data: {} },
            { step: 3, completed: false, optional: false, data: {} },
        ];

        ctrl.enableNextStep = function nextStep() {
            //do not exceed into max step
            if (ctrl.selectedStep >= ctrl.maxStep) {
                return;
            }
            //do not increment ctrl.stepProgress when submitting from previously completed step
            if (ctrl.selectedStep === ctrl.stepProgress - 1) {
                ctrl.stepProgress = ctrl.stepProgress + 1;
            }
            ctrl.selectedStep = ctrl.selectedStep + 1;
        }

        ctrl.moveToPreviousStep = function moveToPreviousStep() {
            if (ctrl.selectedStep > 0) {
                ctrl.selectedStep = ctrl.selectedStep - 1;
            }
        }

        ctrl.submitCurrentStep = function submitCurrentStep(stepData) {
            var deferred = $q.defer();
            ctrl.showBusyText = true;
            if (!stepData.completed) {
                //simulate $http
                $timeout(function () {
                    ctrl.showBusyText = false;
                    deferred.resolve({ status: 200, statusText: 'success', data: {} });
                    //move to next step when success
                    stepData.completed = true;
                    ctrl.enableNextStep();
                }, 1000)
            } else {
                ctrl.showBusyText = false;
                ctrl.enableNextStep();
            }
        }
    }

    angular
        .module('customizer')
        .component('customizer', {
            templateUrl: 'components/customizer/customizer.template.html',
            controller: customizerController,
            bindings: {

            }
        });

})(window.angular);