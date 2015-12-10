app = ( function ( app ) {

  var $userList = $( '#user-list' );

  $.ajax({url: "./users.json"})
    .success(successHandler)
    .error(errorHandler);

  function successHandler (data) {
    // init list
    app.list = new app.List($userList, data);

    // init users
    data.forEach( function ( userData ) {
      app.users.add( new app.User( userData ) )
    });

    // init edit form
    app.edit.init( $userList );

    console.log('all users are resived');
  }

  function errorHandler (error) {
    console.error(error);
  }

  $userList.on('click', '.remove-user', function () {
    var $row = $(this).closest( 'tr' );
    app.users.remove( $row.data('id') );
    $row.remove();
  })

  return app;
})( window.app || {} );