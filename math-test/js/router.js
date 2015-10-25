;(function () {
  'use strict';

  $(document).ready(route);

  $(window).bind('hashchange', route);

  function route() {
    var link = '';

    if (!location.hash || location.hash === '#/') {
      link = 'views/main.html';
    } else {
      link = 'views' + location.hash.replace("#", "") + '.html';
    };

    $.get(link, function(data) {
      $('.content').hide().html(data).fadeIn('slow');
    });
  };

}());