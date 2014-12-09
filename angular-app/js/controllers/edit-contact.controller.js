(function() {
    'use strict';

    angular
        .module('app')
        .controller('EditContactCtrl', EditContactCtrl);

    EditContactCtrl.$inject = ['contacts', '$routeParams'];

    function EditContactCtrl(contacts, $routeParams) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'EditContactCtrl';
        vm.contact = {};
        vm.contactId = $routeParams.contactId;
        vm.get = get;
        vm.update = update;

        get(vm.contactId);

        function get(id) {
            return contacts.get(id)
                .then(function(data) {
                    vm.contact = data;
                    return vm.contact;
            });
        }
        
        function update(contact) {
            return contacts.update(contact)
                .then(function(data) {
                    return data;
            });
        }
    }
})();