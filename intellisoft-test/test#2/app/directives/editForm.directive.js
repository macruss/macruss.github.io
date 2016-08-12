(function() {
  'use strict';

  angular
    .module('App')
    .directive('editForm', editForm);

  function editForm () {
    var directive = {
      templateUrl: 'app/directives/editForm.html',
      restrict: 'E',
      scope: {
        item: '=',
        save: '&'
      }
    };
    return directive;
  }
})();