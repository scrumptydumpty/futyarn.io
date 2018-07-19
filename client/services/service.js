angular.module('app')
    .service('auth', function($http) {
        this.login = function(username, password) {
            var obj = {
                username: username,
                password: password
            };
            $http.post('/api/login', obj)
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
            $http.post('/api/signup', obj)
                .then(function({data}) {
                    console.log(data);
                }) 
                .catch(function(err) {
                    console.log(err); 
                });
        };

        this.retrieveLeaderboardInfo = function() {
            $http.get('/api/leaderboards')
                .then(data => {
                    console.log('success', data)
                }, err => {
                    console.log('error', err)
                })

            console.log('inside function')
        };
    });