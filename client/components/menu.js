angular.module('app')
    .controller('menuCtrl', function (auth) {
        console.log('hello from menu js');
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
        };

        this.toggleLoginButton = () => {
            this.showLoginButton = !this.showLoginButton;
        };

        this.toggleLeaderboard = () => {
            console.log(auth);
            this.showLeaderboard = !this.showLeaderboard;
        };

        this.username = '';
        this.wins = '';
        this.losses = '';
        this.games_played = '';
        this.goals_made = '';
        this.handleLeaderboard = () => {
            auth.retrieveLeaderboardInfo();
        };
    })
    .component('menu', {
        bindings : {
        },
        controller : 'menuCtrl',
        templateUrl : '/templates/menu.html'

    });