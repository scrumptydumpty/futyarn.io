angular.module('app')
  .service('auth', ($http) => {
    this.login = function(username, password, callback) {
      var obj = {
        username: username,
        password: password
      }
      $http.post('/login', obj)
      .then(function({data}) {
        if(callback) {
          callback(data);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
    };
  });