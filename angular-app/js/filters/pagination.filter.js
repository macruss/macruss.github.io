(function() {
    'use strict';

    angular
        .module('app')
        .filter('pagination', pagination);

    function pagination() {
        return function(input, curPage, itemsPerPage) {
            return input.slice((curPage - 1) * itemsPerPage);
        };
    }
})();


