(function() {
  'use strict';

  angular
    .module('App')
    .directive('listOfItems', listOfItems);

  function listOfItems () {
    var directive = {
      templateUrl: 'app/directives/listOfItems.html',
      restrict: 'E',
      scope: {
        items: '=',
        remove: '&'
      }
    };
    return directive;
  }
})();