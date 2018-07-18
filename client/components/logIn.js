angular.module('app')
    .controller('logInCtrl', function() {
        this.handleLogin = () => {
            console.log('click works!');
            // auth.login('russell', 'elyse', function(data) {
            //     console.log(data);
            // });
        };
    })
    .component('logIn', {
        bindings : {},
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });