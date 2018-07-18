angular.module('app')
    .controller('signUpCtrl', function (auth) {
        this.username = '';
        this.password = '';
        this.handleSignUp = () => {
            auth.signUp(this.username, this.password);
        };
    })
    .component('signUp', {
        bindings: {
            username: '<', 
            password: '<'
        },
        controller: 'signUpCtrl',
        templateUrl: '/templates/sign-up.html'

    });