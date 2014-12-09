(function() {
  'use strict';

  angular.module('app')
    .controller('ContactsCtrl', ContactsCtrl);

  ContactsCtrl.$inject = ['contacts', '$log', 'filterFilter'];

  function ContactsCtrl(contacts, $log, filterFilter) {
    var vm = this;
    vm.contacts = [];
    vm.sortField = undefined;
    vm.reverse = false;
    vm.optItemsPerPage = [10, 20, 50];
    
    vm.setTotalItems = setTotalItems;
    vm.sort = sort;
    vm.isSortUp = isSortUp;
    vm.isSortDown = isSortDown;

    activate();

    function activate() {
      vm.contacts = contacts.all();
      vm.totalItems = vm.contacts.length;
      vm.currentPage = 1;
      vm.itemsPerPage = vm.optItemsPerPage[0];
    }

    function setTotalItems() {
      vm.contacts = filterFilter(contacts.all(), vm.search)
      vm.totalItems = vm.contacts.length;
    }

    function sort(fieldName) {
      if(vm.sortField === fieldName)
        vm.reverse = !vm.reverse
      else{
        vm.sortField = fieldName;
        vm.reverse = false;
      }
    }

    function isSortUp(fieldName) {
      return vm.sortField === fieldName && !vm.reverse;
    }

    function isSortDown(fieldName) {
      return vm.sortField === fieldName && vm.reverse;
    }

  }
})();