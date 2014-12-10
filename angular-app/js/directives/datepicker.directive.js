(function() {
    'use strict';

    angular
        .module('app')
        .directive('datepicker', datepicker);

    /* @ngInject */
    function datepicker() {
       var directive = {
            restrict: 'A',
            link:link
        };
        return directive;

        function link(scope, element, attrs) {
            $(function(){
                element.datepicker({
                    dateFormat: "dd-mm-yy",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '1930:2000'
                });
            });
        }
    }
})();

