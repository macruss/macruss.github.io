(function() {
  'use strict';
  angular
    .module('App')
    .run(setChartDefaults);

  function setChartDefaults() {
    var options = {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      responsive: false,
    };

    angular.extend(Chart.defaults.global, options)
  }
})();