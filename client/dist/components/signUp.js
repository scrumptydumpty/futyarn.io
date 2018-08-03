angular.module('app')
    .controller('signUpCtrl', function (auth) {
        this.username = '';
        this.password = '';
        // Passes input from text fields into sign up function in services file
        this.handleSignUp = () => {
            auth.signUp(this.username, this.password);
        };
    })
    .component('signUp', {
        bindings: {
            // Passes down signup function from app.js and app.html file
            togglesignup: '<'
        },
        controller: 'signUpCtrl',
        templateUrl: '/templates/sign-up.html'

    });