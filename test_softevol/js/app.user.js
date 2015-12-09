app = (function (app) {

  function User ( initData ) {
    var binder = new app.DataBinder( initData._id )
      , self = this;

    this._id     = initData._id;
    this.attrs   = {
      name    : initData.name,
      email   : initData.email,
      phone   : initData.phone,
      address : initData.address,
    };
    this._binder = binder;

    // send changes in subscribers
    this.publish();

    // Subscribe on change
    binder.on( this._id + ":change", function( e, attr, val, initiator ) {
      if ( initiator !== self ) {
        self.set( attr, val );
      }
    });
  }

  User.prototype.set = function( attr, val ) {
    this.attrs[ attr ] = val;
    this._binder.trigger( this._id + ':change', [ attr, this.attrs[ attr ], this ]);
  };

  User.prototype.get = function( attr ) {
    return this.attrs[ attr ];
  };

  User.prototype.publish = function () {
    for ( var attr in this.attrs) {
      this._binder.trigger( this._id + ':change', [ attr, this.attrs[ attr ], this ] );
    }
  }

  app.User = User;

  return app;
})( window.app || {} );