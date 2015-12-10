app = ( function ( app ) {

  var count = 0;

  var edit = {

    init: function ( $list ) {
      $list.delegate('.edit-user', 'click', function () {
        var $btn = $( this )

        $btn
          .trigger( 'enable.editor' )
          .siblings( '.end-edit' )
            .removeClass( 'hide' )
          .closest( 'td' )
            .siblings()
              .attr( 'contentEditable', true );

        var firstEditablElement = $btn.closest( 'tr' ).find( 'td:first' )[0];
        
        setCursor( firstEditablElement );
      })

      $list.delegate('.end-edit', 'click', function () {
        $( this )
          .addClass( 'hide' )
          .siblings('.edit-user')
            .trigger( 'disable.editor' )
          .closest( 'td' )
            .siblings()
              .attr( 'contentEditable', false );
      });

      var $btns = $list.find('.edit-user');

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