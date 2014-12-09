(function(){
    'use strict';

    angular.module('app')
        .controller('ContactsCtrl', ContactsCtrl);

    ContactsCtrl.$inject = ['contacts'];

    function ContactsCtrl(contacts) {
        var vm = this;
        vm.contacts = [];

        activate();

        function activate() {
            return contacts.all()
                .then(function(data) {
                    vm.contacts = data;
                    return vm.contacts;
            });
        }

    }
})();