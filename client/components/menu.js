angular.module('app')
    .controller('menuCtrl', function (auth, $http) {
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
            this.toggleLoginButton();
        };

        this.toggleLoginButton = () => {
            this.showLoginButton = !this.showLoginButton;
        };

        this.toggleLeaderboard = () => {
            this.showLeaderboard = !this.showLeaderboard;
        };

        this.leaderboardInfo;
        this.usernames = [];
        this.wins = [];
        this.losses = [];
        this.goals_made = [];
        this.games_played = [];
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
                }).then(() => {
                    for (let i = 0; i < this.leaderboardInfo.length; i++) {
                        this.usernames.push(this.leaderboardInfo[i].username);
                        this.wins.push(this.leaderboardInfo[i].wins);
                        this.losses.push(this.leaderboardInfo[i].losses);
                        this.goals_made.push(this.leaderboardInfo[i].goals_made);
                        this.games_played.push(this.leaderboardInfo[i].games_played);
                    }
                });
            }
        };
    })
    .component('menu', {
        bindings : {
        },
        controller : 'menuCtrl',
        templateUrl : '/templates/menu.html'

    });