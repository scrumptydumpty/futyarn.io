angular.module('app')
    .service('auth', function($http) {
        this.login = function(username, password) {
            var obj = {
                username: username,
                password: password
            };
            $http.post('/login', obj)
                .then(function({data}) {
                    console.log(data);
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        this.signUp = function(username, password) {
            var obj = {
                username: username,
                password: password
            };
            $http.post('/signup', obj)
                .then(function({data}) {
                    console.log(data);
                }) 
                .catch(function(err) {
                    console.log(err); 
                });
        };
    });