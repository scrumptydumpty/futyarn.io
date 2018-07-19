angular.module('app')
    .controller('logInCtrl', function(auth) {
        // console.log('outside', this);
        this.username = '';
        this.password = '';
        this.handleLogin = () => {
            auth.login(this.username, this.password);
            // this.toggle();
        };


    })
    .component('logIn', {
        bindings : {
            toggle: '<'
        },
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });