angular.module('app')
    .service('auth', function($http) {
        this.login = function(username, password, callback) {
          console.log('you are in the service')
            var obj = {
                username: username,
                password: password
            };
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