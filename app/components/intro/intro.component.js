(function(angular) {
    'use strict';

    function introController() {

        /**
         *
         * @type {todoListController}
         */
        var ctrl = this;

    }

    angular.module('intro').component('intro', {
        templateUrl: 'components/intro/intro.template.html',
        controller: introController,
        bindings: {

        }
    });

})(window.angular);
