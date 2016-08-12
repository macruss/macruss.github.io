(function() {
  'use strict';
  angular
    .module('App')
    .service('itemsService', itemsService);

  itemsService.$inject = ['uuid'];

  function itemsService(uuid) {
    var STORAGE_KEY = 'app:items';

    if (!_getFromStorage()) {
      _writeToStorage([]);
    }

    this.get    = get;
    this.getAll = getAll;
    this.add    = add;
    this.update = update;
    this.remove = remove;

    ////////////////
    
    function get(id) {
      var items = _getFromStorage();

      return items.find(function (item) {
        return item.id === id;
      })
    }

    function getAll() {
      return _getFromStorage();
    }
    
    function add(item) {
      var items = _getFromStorage();

      item.id = uuid.generate();
      items.push(item);
      _writeToStorage(items);
    }
    
    function update(newItem) {
      var items = _getFromStorage();
      
      items.forEach(function (item) {
        if (item.id === newItem.id) {
          angular.extend(item, newItem);
        }
      });

      _writeToStorage(items);
    }
    
    function remove(id) {
      var items = _getFromStorage(),
        index;

      index = items.findIndex(function (item) {
        return item.id === id;
      });

      items.splice(index, 1);
      _writeToStorage(items);
    }

    function _getFromStorage() {
      return JSON.parse( localStorage.getItem(STORAGE_KEY) );
    }
    function _writeToStorage(items) {
      localStorage.setItem( STORAGE_KEY, JSON.stringify(items) );
    }
  }
})();