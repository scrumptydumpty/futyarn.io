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
            togglesignup: '<'
        },
        controller: 'signUpCtrl',
        templateUrl: '/templates/sign-up.html'

    });