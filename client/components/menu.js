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
        };

        this.toggleLoginButton = () => {
            this.showLoginButton = !this.showLoginButton;
        };

        this.toggleLeaderboard = () => {
            console.log(auth);
            this.showLeaderboard = !this.showLeaderboard;
        };

        this.leaderboardInfo = {};
        this.handleLeaderboard = () => {
            $http({
                method: 'GET',
                url: '/api/leaderboards'
            }).then((response) => {
                console.log('response', response);
                for (let i = 0; i < response.data.length; i++) {
                    this.leaderboardInfo[i] = {};
                    this.leaderboardInfo[i]['username'] = response.data[i].username;
                    this.leaderboardInfo[i]['wins'] = response.data[i].wins;
                    this.leaderboardInfo[i]['losses'] = response.data[i].losses;
                    this.leaderboardInfo[i]['goals_made'] = response.data[i]['goals_made'];
                    this.leaderboardInfo[i]['games_played'] = response.data[i]['games_played'];
                }
                console.log(this.leaderboardInfo);
            }, (error) => {
                console.log(error);
            });
        };
    })
    .component('menu', {
        bindings : {
        },
        controller : 'menuCtrl',
        templateUrl : '/templates/menu.html'

    });