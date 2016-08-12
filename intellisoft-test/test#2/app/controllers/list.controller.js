(function() {
  'use strict';

  angular
    .module('App')
    .controller('ListController', ListController);

  ListController.$inject = ['itemsService'];

  function ListController(itemsService) {
    var vm = this;
    
    vm.title = 'ListController';
    vm.remove = remove;

    activate();

    ////////////////

    function activate() {
      vm.items = itemsService.getAll();
    }

    function remove(id) {
      itemsService.remove(id);
      activate();
    }
  }
})();