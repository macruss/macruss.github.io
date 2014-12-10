(function() {
    'use strict';

    angular
        .module('app')
        .controller('EditContactCtrl', EditContactCtrl);

    EditContactCtrl.$inject = ['contacts', '$routeParams', '$filter', '$timeout'];

    function EditContactCtrl(contacts, $routeParams, $filter, $timeout) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'EditContactCtrl';
        vm.contact = {};
        vm.get = get;
        vm.isBirthDay = isBirthDay;
        vm.successMsg = false;
        vm.submitAction = update; 

        activate();

        function activate() {
            if (Number($routeParams.id)) {
                get($routeParams.id);
                vm.submitAction = update;
            } else {
                vm.submitAction = add;
            }
        }


        function get(id) {
            return vm.contact = contacts.get(id);
        }
        
        function update(contact) {
            vm.successMsg = true;
            $('input').removeClass('ng-dirty');
            $timeout(function() { vm.successMsg = false; }, 1500);
            return contacts.update(contact);
        }
        function add(contact) {
            vm.successMsg = true;
            $('input').removeClass('ng-dirty');
            $timeout(function() { vm.successMsg = false; }, 1500);
            return contacts.add(contact);
        }

        function isBirthDay() {
            var now = $filter('date')(new Date(), 'dd-MM'),
                cBirthDay = $filter('limitTo')(vm.contact.birth_date, '5');
            return now === cBirthDay;
        }
    }
})();