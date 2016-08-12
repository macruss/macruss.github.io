(function() {
  'use strict';
  angular
    .module('App')
    .factory('toolkit', toolkit);

  function toolkit() {
    var service = {
      random  : random,
      range   : range,
      shuffle : shuffle
    };
    return service;
    ////////////////
    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function range(start, stop, step){
      var a = [start], b = start;

      while (b < stop) {
        b += step;
        a.push(b);
      }

      return a;
    };

    function shuffle(a) {
      var j, x, i;

      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }

      return a;
    }
  }
})();