angular.module('app')
    .controller('logInCtrl', function(auth, $http) {
        this.username = '';
        this.password = '';
        this.handleLogin = () => {
            auth.login(this.username, this.password);
        };

        this.handleGoogleLogin = () => {
            console.log('Inside handle google login function');
            $http({
                method: 'GET',
                url: 'api/login/google'
            }).then(response => {
                console.log(response);
                console.log('you logged in with google')
            }, error => {
                console.log(error);
            })
        }
    })
    .component('logIn', {
        bindings : {
            toggle: '<'
        },
        controller : 'logInCtrl',
        templateUrl : '/templates/log-in.html'

    });