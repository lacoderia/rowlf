(function(angular) {
    'use strict';

    function loginController($rootScope, $q, $timeout, $location, $mdToast, loginService, routingService) {

        /**
         *
         * @type {loginController}
         */
        var ctrl = this;

        var resetToken = undefined;

        ctrl.loading = false;

        ctrl.countries = [
            {"value": "afghanistan", "display": "Afghanistan"},
            {"value": "aland_islands", "display": "Aland Islands"},
            {"value": "albania", "display": "Albania"},
            {"value": "algeria", "display": "Algeria"},
            {"value": "american_samoa", "display": "American Samoa"},
            {"value": "andorra", "display": "Andorra"},
            {"value": "angola", "display": "Angola"},
            {"value": "anguilla", "display": "Anguilla"},
            {"value": "antarctica", "display": "Antarctica"},
            {"value": "antigua_and_barbuda", "display": "Antigua and Barbuda"},
            {"value": "argentina", "display": "Argentina"},
            {"value": "armenia", "display": "Armenia"},
            {"value": "aruba", "display": "Aruba"},
            {"value": "australia", "display": "Australia"},
            {"value": "austria", "display": "Austria"},
            {"value": "azerbaijan", "display": "Azerbaijan"},
            {"value": "bahamas", "display": "Bahamas"},
            {"value": "bahrain", "display": "Bahrain"},
            {"value": "bangladesh", "display": "Bangladesh"},
            {"value": "barbados", "display": "Barbados"},
            {"value": "belarus", "display": "Belarus"},
            {"value": "belgium", "display": "Belgium"},
            {"value": "belize", "display": "Belize"},
            {"value": "benin", "display": "Benin"},
            {"value": "bermuda", "display": "Bermuda"},
            {"value": "bhutan", "display": "Bhutan"},
            {"value": "bolivia", "display": "Bolivia"},
            {"value": "bonaire", "display": "Bonaire"},
            {"value": "bosnia_and_herzegovina", "display": "Bosnia and Herzegovina"},
            {"value": "botswana", "display": "Botswana"},
            {"value": "bouvet_island", "display": "Bouvet Island"},
            {"value": "brazil", "display": "Brazil"},
            {"value": "brunei_darussalam", "display": "Brunei Darussalam"},
            {"value": "bulgaria", "display": "Bulgaria"},
            {"value": "burkina_faso", "display": "Burkina Faso"},
            {"value": "burundi", "display": "Burundi"},
            {"value": "cabo_verde", "display": "Cabo Verde"},
            {"value": "cambodia", "display": "Cambodia"},
            {"value": "cameroon", "display": "Cameroon"},
            {"value": "canada", "display": "Canada"},
            {"value": "cayman_islands", "display": "Cayman Islands"},
            {"value": "central_african_republic", "display": "Central African Republic"},
            {"value": "chad", "display": "Chad"},
            {"value": "chile", "display": "Chile"},
            {"value": "china", "display": "China"},
            {"value": "christmas_island", "display": "Christmas Island"},
            {"value": "cocos_islands", "display": "Cocos Islands"},
            {"value": "colombia", "display": "Colombia"},
            {"value": "comoros", "display": "Comoros"},
            {"value": "congo", "display": "Congo"},
            {"value": "cook_islands", "display": "Cook Islands"},
            {"value": "costa_rica", "display": "Costa Rica"},
            {"value": "cote_d'ivoire", "display": "Cote d'Ivoire"},
            {"value": "croatia", "display": "Croatia"},
            {"value": "cuba", "display": "Cuba"},
            {"value": "curacao", "display": "Curacao"},
            {"value": "cyprus", "display": "Cyprus"},
            {"value": "czech_republic", "display": "Czech Republic"},
            {"value": "denmark", "display": "Denmark"},
            {"value": "djibouti", "display": "Djibouti"},
            {"value": "dominica", "display": "Dominica"},
            {"value": "dominican_republic", "display": "Dominican Republic"},
            {"value": "ecuador", "display": "Ecuador"},
            {"value": "egypt", "display": "Egypt"},
            {"value": "el_salvador", "display": "El Salvador"},
            {"value": "equatorial_guinea", "display": "Equatorial Guinea"},
            {"value": "eritrea", "display": "Eritrea"},
            {"value": "estonia", "display": "Estonia"},
            {"value": "ethiopia", "display": "Ethiopia"},
            {"value": "falkland_islands", "display": "Falkland Islands"},
            {"value": "faroe_islands", "display": "Faroe Islands"},
            {"value": "fiji", "display": "Fiji"},
            {"value": "finland", "display": "Finland"},
            {"value": "france", "display": "France"},
            {"value": "french_guiana", "display": "French Guiana"},
            {"value": "french_polynesia", "display": "French Polynesia"},
            {"value": "french_southern_territories", "display": "French Southern Territories"},
            {"value": "gabon", "display": "Gabon"},
            {"value": "gambia", "display": "Gambia"},
            {"value": "georgia", "display": "Georgia"},
            {"value": "germany", "display": "Germany"},
            {"value": "ghana", "display": "Ghana"},
            {"value": "gibraltar", "display": "Gibraltar"},
            {"value": "greece", "display": "Greece"},
            {"value": "greenland", "display": "Greenland"},
            {"value": "grenada", "display": "Grenada"},
            {"value": "guadeloupe", "display": "Guadeloupe"},
            {"value": "guam", "display": "Guam"},
            {"value": "guatemala", "display": "Guatemala"},
            {"value": "guernsey", "display": "Guernsey"},
            {"value": "guinea", "display": "Guinea"},
            {"value": "guinea-bissau", "display": "Guinea-Bissau"},
            {"value": "guyana", "display": "Guyana"},
            {"value": "haiti", "display": "Haiti"},
            {"value": "heard_and_mcdonald_islands", "display": "Heard and McDonald Islands"},
            {"value": "holy_see", "display": "Holy See"},
            {"value": "honduras", "display": "Honduras"},
            {"value": "hong_kong", "display": "Hong Kong"},
            {"value": "hungary", "display": "Hungary"},
            {"value": "iceland", "display": "Iceland"},
            {"value": "india", "display": "India"},
            {"value": "indonesia", "display": "Indonesia"},
            {"value": "iran", "display": "Iran"},
            {"value": "iraq", "display": "Iraq"},
            {"value": "ireland", "display": "Ireland"},
            {"value": "isle_of_man", "display": "Isle of Man"},
            {"value": "israel", "display": "Israel"},
            {"value": "italy", "display": "Italy"},
            {"value": "jamaica", "display": "Jamaica"},
            {"value": "japan", "display": "Japan"},
            {"value": "jersey", "display": "Jersey"},
            {"value": "jordan", "display": "Jordan"},
            {"value": "kazakhstan", "display": "Kazakhstan"},
            {"value": "kenya", "display": "Kenya"},
            {"value": "kiribati", "display": "Kiribati"},
            {"value": "korea", "display": "Korea"},
            {"value": "kuwait", "display": "Kuwait"},
            {"value": "kyrgyzstan", "display": "Kyrgyzstan"},
            {"value": "lao_peoples", "display": "Lao People's"},
            {"value": "latvia", "display": "Latvia"},
            {"value": "lebanon", "display": "Lebanon"},
            {"value": "lesotho", "display": "Lesotho"},
            {"value": "liberia", "display": "Liberia"},
            {"value": "libya", "display": "Libya"},
            {"value": "liechtenstein", "display": "Liechtenstein"},
            {"value": "lithuania", "display": "Lithuania"},
            {"value": "luxembourg", "display": "Luxembourg"},
            {"value": "macao", "display": "Macao"},
            {"value": "macedonia", "display": "Macedonia"},
            {"value": "madagascar", "display": "Madagascar"},
            {"value": "malawi", "display": "Malawi"},
            {"value": "malaysia", "display": "Malaysia"},
            {"value": "maldives", "display": "Maldives"},
            {"value": "mali", "display": "Mali"},
            {"value": "malta", "display": "Malta"},
            {"value": "marshall_islands", "display": "Marshall Islands"},
            {"value": "martinique", "display": "Martinique"},
            {"value": "mauritania", "display": "Mauritania"},
            {"value": "mauritius", "display": "Mauritius"},
            {"value": "mayotte", "display": "Mayotte"},
            {"value": "mexico", "display": "Mexico"},
            {"value": "micronesia", "display": "Micronesia"},
            {"value": "moldova", "display": "Moldova"},
            {"value": "monaco", "display": "Monaco"},
            {"value": "mongolia", "display": "Mongolia"},
            {"value": "montenegro", "display": "Montenegro"},
            {"value": "montserrat", "display": "Montserrat"},
            {"value": "morocco", "display": "Morocco"},
            {"value": "mozambique", "display": "Mozambique"},
            {"value": "myanmar", "display": "Myanmar"},
            {"value": "namibia", "display": "Namibia"},
            {"value": "nauru", "display": "Nauru"},
            {"value": "nepal", "display": "Nepal"},
            {"value": "netherlands", "display": "Netherlands"},
            {"value": "new_caledonia", "display": "New Caledonia"},
            {"value": "new_zealand", "display": "New Zealand"},
            {"value": "nicaragua", "display": "Nicaragua"},
            {"value": "niger", "display": "Niger"},
            {"value": "nigeria", "display": "Nigeria"},
            {"value": "niue", "display": "Niue"},
            {"value": "norfolk_island", "display": "Norfolk Island"},
            {"value": "northern_mariana_islands", "display": "Northern Mariana Islands"},
            {"value": "norway", "display": "Norway"},
            {"value": "oman", "display": "Oman"},
            {"value": "pakistan", "display": "Pakistan"},
            {"value": "palau", "display": "Palau"},
            {"value": "palestine", "display": "Palestine"},
            {"value": "panama", "display": "Panama"},
            {"value": "papua_new_guinea", "display": "Papua New Guinea"},
            {"value": "paraguay", "display": "Paraguay"},
            {"value": "peru", "display": "Peru"},
            {"value": "philippines", "display": "Philippines"},
            {"value": "pitcairn", "display": "Pitcairn"},
            {"value": "poland", "display": "Poland"},
            {"value": "portugal", "display": "Portugal"},
            {"value": "puerto_rico", "display": "Puerto Rico"},
            {"value": "qatar", "display": "Qatar"},
            {"value": "reunion", "display": "Reunion"},
            {"value": "romania", "display": "Romania"},
            {"value": "russian_federation", "display": "Russian Federation"},
            {"value": "rwanda", "display": "Rwanda"},
            {"value": "saint_barthelemy", "display": "Saint Barthelemy"},
            {"value": "saint_helena", "display": "Saint Helena"},
            {"value": "saint_kitts_and_nevis", "display": "Saint Kitts and Nevis"},
            {"value": "saint_lucia", "display": "Saint Lucia"},
            {"value": "saint_martin", "display": "Saint Martin"},
            {"value": "saint_pierre_and_miquelon", "display": "Saint Pierre and Miquelon"},
            {"value": "saint_vincent_and_the_grenadines", "display": "Saint Vincent and the Grenadines"},
            {"value": "samoa", "display": "Samoa"},
            {"value": "san_marino", "display": "San Marino"},
            {"value": "sao_tome_and_principe", "display": "Sao Tome and Principe"},
            {"value": "saudi_arabia", "display": "Saudi Arabia"},
            {"value": "senegal", "display": "Senegal"},
            {"value": "serbia", "display": "Serbia"},
            {"value": "seychelles", "display": "Seychelles"},
            {"value": "sierra_leone", "display": "Sierra Leone"},
            {"value": "singapore", "display": "Singapore"},
            {"value": "sint_maarten", "display": "Sint Maarten"},
            {"value": "slovakia", "display": "Slovakia"},
            {"value": "slovenia", "display": "Slovenia"},
            {"value": "solomon_islands", "display": "Solomon Islands"},
            {"value": "somalia", "display": "Somalia"},
            {"value": "south_africa", "display": "South Africa"},
            {"value": "south_georgia", "display": "South Georgia"},
            {"value": "south_sudan", "display": "South Sudan"},
            {"value": "spain", "display": "Spain"},
            {"value": "sri_lanka", "display": "Sri Lanka"},
            {"value": "sudan", "display": "Sudan"},
            {"value": "suriname", "display": "Suriname"},
            {"value": "svalbard_and_jan mayen", "display": "Svalbard and Jan Mayen"},
            {"value": "swaziland", "display": "Swaziland"},
            {"value": "sweden", "display": "Sweden"},
            {"value": "switzerland", "display": "Switzerland"},
            {"value": "syrian_arab_republic", "display": "Syrian Arab Republic"},
            {"value": "taiwan", "display": "Taiwan"},
            {"value": "tajikistan", "display": "Tajikistan"},
            {"value": "tanzania", "display": "Tanzania"},
            {"value": "thailand", "display": "Thailand"},
            {"value": "timor_leste", "display": "Timor Leste"},
            {"value": "togo", "display": "Togo"},
            {"value": "tokelau", "display": "Tokelau"},
            {"value": "tonga", "display": "Tonga"},
            {"value": "trinidad_and_tobago", "display": "Trinidad and Tobago"},
            {"value": "tunisia", "display": "Tunisia"},
            {"value": "turkey", "display": "Turkey"},
            {"value": "turkmenistan", "display": "Turkmenistan"},
            {"value": "turks_and_caicos islands", "display": "Turks and Caicos Islands"},
            {"value": "tuvalu", "display": "Tuvalu"},
            {"value": "uganda", "display": "Uganda"},
            {"value": "ukraine", "display": "Ukraine"},
            {"value": "united_arab_emirates", "display": "United Arab Emirates"},
            {"value": "united_kingdom", "display": "United Kingdom"},
            {"value": "united_states_of_america", "display": "United States of America"},
            {"value": "uruguay", "display": "Uruguay"},
            {"value": "uzbekistan", "display": "Uzbekistan"},
            {"value": "vanuatu", "display": "Vanuatu"},
            {"value": "venezuela", "display": "Venezuela"},
            {"value": "viet_nam", "display": "Viet Nam"},
            {"value": "virgin_islands", "display": "Virgin Islands"},
            {"value": "wallis_and_futuna", "display": "Wallis and Futuna"},
            {"value": "western_sahara", "display": "Western Sahara"},
            {"value": "yemen", "display": "Yemen"},
            {"value": "zambia", "display": "Zambia"},
            {"value": "zimbabwe", "display": "Zimbabwe"}
        ];
        ctrl.selectedItem  = null;
        ctrl.searchText    = null;

        var createFilterFor = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

        ctrl.querySearch = function(query) {
            var results = query ? ctrl.countries.filter( createFilterFor(query) ) : ctrl.countries;
            var deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        // Object that holds all possible views
        ctrl.VIEWS = {
            LOGIN: 'login',
            SIGNUP: 'signup',
            FORGOT: 'forgot',
            RESET: 'reset',
            WAIT: 'wait'
        };

        var currentView = ctrl.VIEWS.LOGIN;

        // Object that holds the username and password values
        ctrl.credentials = {
            email: '',
            password: undefined
        };

        // Object that holds new user parameters
        ctrl.newUser = {
            name: undefined,
            address: undefined,
            zip: undefined,
            phone: undefined,
            city: undefined,
            state: undefined,
            country: undefined,
            email: '',
            password: '',
            confirmation: '',
            reference: undefined,
            company: undefined,
            businessType: undefined,
            jobTitle: undefined,
            installationType: undefined,
            aboutUs: undefined,
            projectReferences: undefined,
            designsQuantity: undefined,
            deliveryAddress: undefined,
            message: undefined,
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
                    break;
                case 'signup':
                    ctrl.newUser = angular.copy(originalNewUser);
                    break;
                case 'forgot':
                    ctrl.forgot = angular.copy(originalForgot);
                    break;
                case 'reset':
                    ctrl.reset = angular.copy(originalReset);
                    break;
                default:
                    break;
            }
        };

        // Function to authenticate a user
        ctrl.login = function() {
            document.activeElement.blur();

            if(ctrl.loginForm.$valid) {

                ctrl.loading = true;

                loginService.login(ctrl.credentials)
                    .then(function(data) {
                        if(data.user){
                            $location.path('/customizer');
                        }
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'An error occured, please try again later...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });
            }

        };

        // Function to register a new user
        ctrl.signUp = function() {
            document.activeElement.blur();

            if(ctrl.signupForm.$valid) {

                if(ctrl.selectedCountry) {
                    ctrl.loading = true;

                    loginService.getIpInfo()
                        .then(function (location) {
                            var location = location;

                            var user = {
                                name: ctrl.newUser.name,
                                address: ctrl.newUser.address,
                                zip: ctrl.newUser.zip,
                                phone: ctrl.newUser.phone,
                                city: ctrl.newUser.city,
                                state: ctrl.newUser.state,
                                country: ctrl.selectedCountry.display,
                                email: ctrl.newUser.email,
                                password: ctrl.newUser.password,
                                password_confirmation: ctrl.newUser.confirmation,
                                reference: ctrl.newUser.reference,
                                company_name: ctrl.newUser.company,
                                business_type: ctrl.newUser.businessType,
                                job_title: ctrl.newUser.jobTitle,
                                type_of_installation: ctrl.newUser.installationType,
                                about_us: ctrl.newUser.aboutUs,
                                project_references: ctrl.newUser.projectReferences,
                                designs_quantities: ctrl.newUser.designsQuantity,
                                complete_delivery_address: ctrl.newUser.deliveryAddress,
                                message: ctrl.newUser.message,
                                location: location
                            };

                            var internal = !$rootScope.iframe;

                            loginService.signUp(user, internal)
                                .then(function(data) {
                                    ctrl.changeView(ctrl.VIEWS.WAIT);
                                    ctrl.loading = false;
                                }, function(error) {
                                    var errorText = 'An error occured, please try again later...';
                                    if(error && error.errors){
                                        errorText = error.errors[0].title;
                                    }

                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent(errorText)
                                            .position('top right')
                                    );

                                    ctrl.loading = false;
                                });

                            loginService.signUpHubspot(user);

                        }, function(error) {
                            var errorText = 'An error occured, please try again later...';
                            if(error && error.errors){
                                errorText = error.errors[0].title;
                            }

                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(errorText)
                                    .position('top right')
                            );

                            ctrl.loading = false;
                        });
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You must select a country from the country list')
                            .position('top right')
                    );
                }

            }


        };

        // Function to recover user password
        ctrl.recoverPassword = function() {
            document.activeElement.blur();

            if(ctrl.forgotForm.$valid) {

                ctrl.loading = true;

                loginService.recoverPassword(ctrl.forgot)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('You\'ll receive an email with further instructions to recover your password.')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'An error occured, please try again later...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });
            }
        };

        // Function to reset user password
        ctrl.resetPassword = function() {
            document.activeElement.blur();

            var reset = {
                reset_password_token: resetToken,
                password: ctrl.reset.password,
                password_confirmation: ctrl.reset.confirmation
            };

            if(ctrl.resetForm.$valid) {

                ctrl.loading = true;

                loginService.resetPassword(reset)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Your password was updated.')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'An error occured, please try again later...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

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