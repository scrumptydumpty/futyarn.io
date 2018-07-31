angular.module('app')
    .controller('logInCtrl', function(auth/*, $http*/) {
        this.username = '';
        this.password = '';
        // Passes username and password from text fields into service function in services file
        this.handleLogin = () => {
            auth.login(this.username, this.password);
        };

        // This is code that can be uncommented for a google auth button

        // this.handleGoogleLogin = () => {
        //     console.log('Inside handle google login function');
        //     $http({
        //         method: 'GET',
        //         url: 'api/login/google'
        //     }).then(response => {
        //         console.log(response);
        //         console.log('you logged in with google');
        //     }, error => {
        //         console.log(error);
        //     })
        // }
    })
    .component('logIn', {
        bindings : {
            // Passing down toggle function from app.js and app.html file
            // This is angular js's version of "props"
            toggle: '<'
        },
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });