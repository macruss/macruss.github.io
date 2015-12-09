app = (function (app) {

  var users = {
    users: [],
    getAll: function() {
      return this.users;
    },
    add: function (user) {
      this.users.push(user);
    },
    get: function (id) {
      var result;

      this.users.forEach(function (user, i, users) {
        if (user._id === id) {
          result = users[i];
        }
      });
      return result;
    },
    remove: function (id) {
      this.users.forEach(function (user, i, users) {
        if (user._id === id) {
          users.splice(i, 1);
        }
      })
    }
  };

  app.users = users;

  return app;
})(window.app || {});