(function() {
  'use strict';

  angular.module('app')
    .controller('ContactsCtrl', ContactsCtrl);

  ContactsCtrl.$inject = ['contacts'];

  function ContactsCtrl( contacts) {
    var vm = this;
    vm.contacts = [];
    vm.sortColumns = [
            {name:'Name', value:'first_name'},
            {name:'Surname' ,value:'last_name'},
            {name:'Email' ,value:'email'},
            {name:'Phone' ,value:'phone'},
            {name:'Company' ,value:'company'},
            {name:'Date of birth',value:'birth_date'}
        ];
    vm.orderByColumn = vm.sortColumns[0];

    activate();

// pagination

    vm.totalItems = 10;
    vm.currentPage = 5;
    // $scope.maxSize = 10;
    

    // $scope.setPage = function (pageNo) {
    //   $scope.currentPage = pageNo;
    // };
    // $scope.bigTotalItems = 10;
    // $scope.bigCurrentPage = 123;



    function activate() {
      vm.contacts = contacts.all()
    }

  }
})();