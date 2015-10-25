;(function () {
  'use strict';

  function Questions() {
    this.opts = ['sum', 'sub', 'mult', 'dev'];
  }

  function randInt(max){
    return Math.ceil(Math.random()*max);
  }

  Questions.prototype.generate = function() {
    var a = randInt(10),
        b = randInt(10),
        operators = {
          sum: ' + ',
          sub: ' - ',
          mult: ' * ',
          dev: ' / '
        },
        randOperator = operators[this.opts[randInt(this.opts.length -1)]],
        expression = '';

        if (randOperator === ' - ' && b > a) {
          expression = b + randOperator + a;
        } else {
          expression = a + randOperator + b;
        }

        this.result = eval(expression);

    return expression;
  };

  Questions.prototype.checkAnswer = function(answer) {
    return answer === this.result;
  };

  function Score() {
    this.right = 0;
    this.wrong = 0;
  }

  Score.prototype.update = function(answ) {
    if (answ) {
      this.right += 1;
    } else {
      this.wrong += 1;
    }
  };

  function render() {
    $('.right span').text(score.right);
    $('.wrong span').text(score.wrong);
    $('.question').text(questions.generate() + ' =');
    $('form[name="answer"] > input').val('')
  }

  var questions = new Questions(),
      score = new Score();

  $(document).ajaxComplete(function() {

    // if Setup page

    if (location.hash === '#/setup') {
      var inputs = $('.setup > input');

      // init checkbox

      inputs.each(function() {
        if ($.inArray($(this).attr('id'), questions.opts) !== -1) {
          $(this).prop('checked', true);
        }
      });

      inputs.bind('change', function(event) {
        var el = event.target,
            operator = $(el).attr('id'),
            opts = questions.opts;

        if ($(el).prop('checked')) {
          opts.push(operator);
        } else {

          if (opts.length <= 1) {          // at least one checkbox
            $(el).prop('checked', true); 
            return false;
          }

          opts.splice($.inArray(operator, opts), 1);
        }
      });

    } else {

      // if Test page

      render();

      // Submit answer

      $('form[name="answer"]').bind('submit', function() {
        var answer = +$('form[name="answer"] > input').val();

        if (answer && !isNaN(answer) && answer >= 0) {
          score.update(questions.checkAnswer(answer));
          render();
        }

        return false;
      });
    }
  });

  // nav tabs event

  $('.nav-tabs a').click(function() {
    var link = $(this).attr('href');

    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    location.hash = link;

    return false;
  });
}());