(function() {
  'use strict';

  $(document).ajaxComplete(function() {

    if (location.hash === '#/') {

      $('.answer').keyup(function() {
        var answer = $(this).val(),
            expr = /^\d+$/;           // positive integers

        if (answer && !expr.test(answer)){
          $(this).addClass('error');
        } else {
          $(this).removeClass('error');
        }
      });

    };
  })
}());