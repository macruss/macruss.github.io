(function() {
    'use strict';

    angular.module('app')
        .config(config);

        function config($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'partials/contacts.html',
                    controller: 'ContactsCtrl',
                    controllerAs: 'vm'
                })
                .when('/:contactId', {
                    templateUrl: 'partials/edit-contact.html',
                    controller: 'EditContactCtrl',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/'
                });

        }
    
})();