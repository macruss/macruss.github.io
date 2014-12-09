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
            return vm.contact = contacts.get(id);
        }
        
        function update(contact) {
            return contacts.update(contact);
        }
    }
})();