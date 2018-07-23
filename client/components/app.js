angular.module('app')
    .controller('appCtrl', function (auth, $http){
        this.showLoginForm = false;
        this.showSignUpForm = false;
        this.showRules = false;
        this.showLogOut = false;
        this.showLoginButton = false;
        this.showLeaderboard = false;

        this.toggleLoginForm = () => {
            this.showLoginForm = !this.showLoginForm;
        };

        this.toggleSignUpForm = () => {
            this.showSignUpForm = !this.showSignUpForm;
        };

        this.toggleRules = () => {
            this.showRules = !this.showRules;
        };

        this.toggle = () => {
            this.showLogOut = !this.showLogOut;
            this.toggleLoginForm();
            this.toggleLoginButton();
        };

        this.toggleLoginButton = () => {
            this.showLoginButton = !this.showLoginButton;
        };

        this.toggleLeaderboard = () => {
            this.showLeaderboard = !this.showLeaderboard;
        };

        this.leaderboardInfo;
        this.submitGetRequest = false;
        this.handleLeaderboard = () => {
            if (!this.submitGetRequest) {
                $http({
                    method: 'GET',
                    url: '/api/leaderboards'
                }).then((response) => {
                    console.log('response', response);
                    this.submitGetRequest = true;
                    this.leaderboardInfo = response.data;
                }, (error) => {
                    console.log(error);
                });
            }
        };
    })
    .component('app', {
        bindings : {},
        controller : 'appCtrl',
        templateUrl : './templates/app.html'
    });