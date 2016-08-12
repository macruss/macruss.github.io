(function() {
  'use strict';

  angular
    .module('App')
    .directive('randomTables', randomTables);

  randomTables.$inject = ['toolkit'];

  function randomTables(toolkit) {
    var directive = {
      templateUrl: 'app/directives/randomTables.html',
      link: link,
      require: '^ngController',
      replace: true,
      restrict: 'E'
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      var random = toolkit.random,
        shuffle = toolkit.shuffle,
        range = toolkit.range;

      var table1 = _newFilledArray(5, function () {
        return {
          x: random(1, 10),
          y: random(1, 10)
        }
      });

      var _temp = shuffle(range(2, 10, 2));
      var table2 = _newFilledArray(5, function (_, i) {
        return {
          x: _temp[i],
          y: random(1, 10)
        }
      });

      angular.extend(ctrl.tables, {
        'table 1' : table1,
        'table 2' : table2,
      })

      scope.selectTable = selectTable;

      function selectTable(table) {
        ctrl.activeTable = table;
      }

      function _newFilledArray(len, f) {
        return new Array(len + 1).join('0').split('').map(f);
      }
    }
  }
})();