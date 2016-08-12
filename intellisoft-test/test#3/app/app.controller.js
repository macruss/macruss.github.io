(function() {
  'use strict';

  angular
    .module('App')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', '$timeout'];

  /* @ngInject */
  function AppController($scope, $timeout) {
    var vm = this,
      chartTypes = {
        'table 1': 'bubble',
        'table 2' : 'bar'
      };
    vm.title = 'AppController';
    vm.tables = {};
    vm.activeTable = 'table 1';

    $timeout(activate);

    ////////////////
    
    $scope.$watch(
      function () {return vm.activeTable},
      function (activeTable) {
        if (vm.tables[activeTable]) {
          activate();
        }
      })

    function activate() {
      vm.chartData = {
        title: vm.activeTable,
        data: vm.tables[vm.activeTable],
        type: chartTypes[vm.activeTable]
      };
    }
  }
})();