(function() {
  'use strict';

  angular
    .module('App')
    .directive('ngChart', ngChart);

  ngChart.$inject = ['$timeout'];

  function ngChart($timeout) {
    var directive = {
      templateUrl: 'app/directives/ngChart.html',
      link: link,
      require: '^ngController',
      replace: true,
      restrict: 'E',
      scope: {
        chartData: '=ngChartData'
      }
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      var ctx = element.find('canvas'),
        chartData = scope.chartData,
        chart;

      scope.$watch('chartData', function (chartData) {
        if (chart) {
          chart.destroy();
        }

        if (chartData) {
          var config = getConfig(chartData);
          chart = new Chart(ctx, config);
        }
      });

      function getConfig(chartData) {
        if (chartData.type === 'bubble'){
          return {
            type: 'bubble',
            data: {
              datasets: [{ data: chartData.data }]
            },
            options: {
              title: { display: true,  text: chartData.title },
              elements: {
                point: {
                  radius: 10,
                  backgroundColor:"#FF6384",
                }
              },
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero:true,
                    min: 0,
                    max: 10
                  },
                }],
                yAxes: [{
                  ticks: {
                    beginAtZero:true,
                    min: 0,
                    max: 10,
                  },
                }],
              }
            }
          }
        }
        if (chartData.type === 'bar') {
          return {
            type: 'bar',
            data: {
              labels : chartData.data.map(function (o) {return o.x}),
              datasets: [{
                data: chartData.data.map(function (o) {return o.y})
              }]
            },
            options: {
              title: { display: true, text: chartData.title },
              scales: {
                yAxes: [{ stacked: true }],
              }
            }
          }
        };
      }
    }
  }
})();