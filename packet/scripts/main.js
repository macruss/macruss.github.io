(function(){
  function addEvent(elem, type, handler) {
    if (elem.addEventListener) {
      elem.addEventListener(type, handler, false);
    } else {
      elem.attachEvent("on"+type, handler);
      alert(type);
    };
  };

  function getContent(h){
    var h = h || 'main';

    $.get('views/' + h +'.html').done(function(data) {
      $('.content').html(data);
    });

  };

  function handlHash() {
    var l = $(this).attr('href').slice(1),
        h = document.location.hash.slice(1);

    if (l == h) return;

    switch(l){
      case 'news':
        getContent(l);
        break
      case 'about':
        getContent(l);
        break
      default:
        getContent('main');
        break
    };

  };

  getContent(document.location.hash.slice(1));



  addEvent(window, 'hashchange', function(event) {
    getContent(document.location.hash.slice(1));
  });

  $('.nav a').click(handlHash);

}());


