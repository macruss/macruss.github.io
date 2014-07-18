(function(){
    var elem = $('#heder');
    setInterval(function(){
        if (elem.css('color') === 'rgb(66, 75, 255)')elem.css('color', 'rgb(253, 55, 55)');
        else elem.css('color', 'rgb(66, 75, 255)');
    }, 500);

})();