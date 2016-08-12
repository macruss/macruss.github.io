(function() {
  'use strict';

  angular
    .module('App')
    .controller('AddController', AddController);

  AddController.$inject = ['itemsService'];

  function AddController(itemsService) {
    var vm = this;

    vm.title = 'AddController';
    vm.item = {};
    vm.save = save;

    function save() {
      itemsService.add(vm.item);
      vm.item = {};
    }
  }
})();