app = ( function ( app ) {

  var count = 0;

  var edit = {

    init: function ( $btns ) {
      $btns.on( 'click', function () {
        var $btn = $( this )
        
        $btn.closest( 'tr' )
          .attr( 'contentEditable', true )
          .focus()
          .on('blur', function onblurHandler() {
             $( this )
              .attr( 'contentEditable', false)
              .off( 'blur', onblurHandler );

             $btn.trigger( 'disable.editor' )
             $btn.parent().children().removeClass( 'hidden' );
          });

        $btn.parent().children().addClass('hidden');

        var firstEditablElement = $btn.closest( 'tr' ).find( 'td:first' )[0];
        setCursor( firstEditablElement );

        $btn.trigger( 'enable.editor' );
      })

      $btns.on( 'enable.editor', function () {
        $(this)
          .closest('table')
            .addClass('frozen')
            .end()
          .closest('tr')
            .addClass('active');
      });


      $btns.on( 'disable.editor', function () {
        $(this)
          .closest('table')
            .removeClass('frozen')
            .end()
          .closest('tr')
            .removeClass('active');
      });
    }
  }


  function setCursor( el ) {
    var range = document.createRange();
    range.setStart( el, 0 );

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange( range );
  }

  app.edit = edit;

  return app;
})( window.app || {} );