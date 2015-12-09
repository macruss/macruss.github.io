app = (function (app) {

  function DataBinder( id ) {
    var pubSub = $({})
      , attr = "bind-" + id
      , msg = id + ":change";

    $( document ).delegate( "[data-" + attr + "]", "change keyup", function( e ) {
      var $input = $( this )
        , value = $input.is("input, textarea") ? $input.val() : $input.text();

      pubSub.trigger( msg, [ $input.data( attr ), value ] );
    });

    pubSub.on( msg, function( e, prop, val ) {
      $( "[data-" + attr + "=" + prop + "]" ).each( function() {
        var $bound = $( this );

        if ( $bound.is("input, textarea, select") ) {
          $bound.val( val );
        } else {
          $bound.html( val );
        }
      });
    });

    return pubSub;
  }

  app.DataBinder = DataBinder;

  return app;
})(window.app || {});