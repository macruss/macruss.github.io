(function () {
  'use strict';

  angular
    .module('App')
    .config(routing);

  routing.$inject = ['$routeProvider'];

  function routing($routeProvider) {
    $routeProvider
      .when('/list', {
        templateUrl: 'app/views/list.html',
        controller: 'ListController',
        controllerAs: 'vm'
      })
      .when('/list/add', {
        templateUrl: 'app/views/form.html',
        controller: 'AddController',
        controllerAs: 'vm'
      })
      .when('/list/edit/:id', {
        templateUrl: 'app/views/form.html',
        controller: 'EditController',
        controllerAs: 'vm'
      })
      .otherwise('/list');
  }
})();