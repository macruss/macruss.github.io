app = (function (app) {

  function List (container, items) {
    this.$container = $(container);
    this.items = items;

    this.init();
  };

  List.prototype.init = function() {
    var self = this;

    this.$list = this.$container.find( '[data-repeat]' )
    this.$rowTmpl = this.$list
      .children()
      .clone();

    this.$list.empty();

    this.items.forEach(function ( item ) {
      self.add( item );
    });
  };

  List.prototype.add = function(item) {
    var $row = this.$rowTmpl.clone();

    $row.find( '[data-bind]' ).each(function() {
      var $el  = $(this)
        , attr = $el.data( 'bind' ).split( '.' ).slice( -1 )
        , prop = item[ attr ];

      if ( prop ) {
        $el
          .removeAttr( 'data-bind' )
          .attr( 'data-bind-' + item._id , attr );
      }
    });

    $row
      .data('id', item._id)
      .appendTo( this.$list );
  };

  app.List = List;

  return app;
})(window.app || {});