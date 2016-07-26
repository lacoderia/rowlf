(function(angular) {
    'use strict';

    function loginController($timeout, $location, $mdToast, loginService, routingService) {

        /**
         *
         * @type {loginController}
         */
        var ctrl = this;

        var currentView = 'login';
        var resetToken = undefined;

        ctrl.loading = false;

        // Object that holds all possible views
        ctrl.VIEWS = {
            LOGIN: 'login',
            SIGNUP: 'signup',
            FORGOT: 'forgot',
            RESET: 'reset',
            WAIT: 'wait'
        };

        // Object that holds the username and password values
        ctrl.credentials = {
            email: '',
            password: undefined
        };

        // Object that holds new user parameters
        ctrl.newUser = {
            firstName: undefined,
            lastName: undefined,
            city: undefined,
            state: undefined,
            country: undefined,
            email: '',
            password: '',
            confirmation: '',
            reference: undefined
        };

        // Object that holds the recover password data
        ctrl.forgot = {
            email: ''
        };

        // Object that holds the recover password data
        ctrl.reset = {
            password: undefined,
            confirmation: undefined
        };

        // Private variables
        var originalCredentials = angular.copy(ctrl.credentials);
        var originalNewUser = angular.copy(ctrl.newUser);
        var originalForgot = angular.copy(ctrl.forgot);
        var originalReset = angular.copy(ctrl.reset);

        // Function that returns if the parameter view is the current view
        ctrl.isCurrentView = function(view){
            return (view == currentView);
        };

        // Function that toggles to login view
        ctrl.changeView = function(view){
            resetViewForm(view);
            currentView = view;
        };

        // Function to reset forms
        var resetViewForm = function(formName){

            switch(formName){
                case 'login':
                    ctrl.credentials = angular.copy(originalCredentials);
                    //ctrl.loginForm.$setPristine();
                    //ctrl.loginForm.$setUntouched();
                    break;
                case 'signup':
                    ctrl.newUser = angular.copy(originalNewUser);
                    //ctrl.signupForm.$setPristine();
                    //ctrl.signupForm.$setUntouched();
                    break;
                case 'forgot':
                    ctrl.forgot = angular.copy(originalForgot);
                    //ctrl.forgotForm.$setPristine();
                    //ctrl.forgotForm.$setUntouched();
                    break;
                case 'reset':
                    ctrl.reset = angular.copy(originalReset);
                    //ctrl.resetForm.$setPristine();
                    //ctrl.resetForm.$setUntouched();
                    break;
                default:
                    break;
            }
        };

        // Function to authenticate a user
        ctrl.login = function() {

            ctrl.loading = true;

            if(ctrl.loginForm.$valid) {

                loginService.login(ctrl.credentials)
                    .then(function(data) {
                        if(data.user){
                            $location.path('/customizer');
                        }
                        ctrl.loading = false;
                    }, function(error) {
                        if(error && error.errors){
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(error.errors[0].title)
                                    .position('top right')
                            );
                        }
                        ctrl.loading = false;
                    });
            }

        };

        // Function to register a new user
        ctrl.signUp = function() {

            ctrl.loading = true;

            var user = {
                first_name: ctrl.newUser.firstName,
                last_name: ctrl.newUser.lastName,
                city: ctrl.newUser.city,
                state: ctrl.newUser.state,
                country: ctrl.newUser.country,
                email: ctrl.newUser.email,
                password: ctrl.newUser.password,
                password_confirmation: ctrl.newUser.confirmation,
                reference: ctrl.newUser.reference
            };

            var internal = true;

            if(ctrl.signupForm.$valid) {

                loginService.signUp(user, internal)
                    .then(function(data) {
                        ctrl.changeView(ctrl.VIEWS.WAIT);
                        ctrl.loading = false;
                    }, function(error) {
                        if(error && error.errors){
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(error.errors[0].title)
                                    .position('top right')
                            );
                        }
                        ctrl.loading = false;
                    });
            }
        };

        // Function to recover user password
        ctrl.recoverPassword = function() {

            ctrl.loading = true;

            if(ctrl.forgotForm.$valid) {

                loginService.recoverPassword(ctrl.forgot)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Recibirás instrucciones en tu correo electrónico para recuperar tu contraseña')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        if(error && error.errors){
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(error.errors[0].title)
                                    .position('top right')
                            );
                        }
                        ctrl.loading = false;
                    });
            }
        };

        // Function to reset user password
        ctrl.resetPassword = function() {

            ctrl.loading = true;

            var reset = {
                reset_password_token: resetToken,
                password: ctrl.reset.password,
                password_confirmation: ctrl.reset.confirmation
            };

            if(ctrl.resetForm.$valid) {

                loginService.resetPassword(reset)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Tu contraseña fue actualizada. Ya puedes iniciar sesión.')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        if(error && error.errors){
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(error.errors[0].title)
                                    .position('top right')
                            );
                        }
                        ctrl.loading = false;
                    });
            }
        };

        this.$onInit = function() {
            resetToken = routingService.getParam('reset_password_token');
            $timeout(function(){
                if (resetToken) {
                    ctrl.changeView(ctrl.VIEWS.RESET);
                }
            }, 0);
        };

    }

    angular
        .module('login')
        .component('login', {
            templateUrl: 'components/login/login.template.html',
            controller: loginController,
            bindings: {

            }
        });

})(window.angular);