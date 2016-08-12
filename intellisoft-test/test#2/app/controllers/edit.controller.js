(function() {
  'use strict';

  angular
    .module('App')
    .controller('EditController', EditController);

  EditController.$inject = ['$routeParams', 'itemsService'];

  function EditController($routeParams, itemsService) {
    var vm = this;

    vm.title = 'EditController';
    vm.save  = save;

    activate();

    function activate() {
      vm.item = itemsService.get($routeParams.id)
    }
    function save() {
      itemsService.update(vm.item);
    }
  }
})();