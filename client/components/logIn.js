angular.module('app')
    .controller('logInCtrl', function(auth) {
        this.username = '';
        this.password = '';
        this.handleLogin = () => {
            auth.login(this.username, this.password);
        };


    })
    .component('logIn', {
        bindings : {
            toggle: '<'
        },
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });