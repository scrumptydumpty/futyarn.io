angular.module('app')
    .controller('logInCtrl', function(auth) {
        this.username = '';
        this.password = '';
        this.handleLogin = () => {
            auth.login(this.username, this.password, function(data) {
                console.log(data);
            });
        };
    })
    .component('logIn', {
        bindings : {
            username: '<',
            password: '<'
        },
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });