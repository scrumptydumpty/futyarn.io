angular.module('app')
    .controller('appCtrl', function (auth, $http){
        // These function toggle buttons and forms using ng-if in app.html file
        this.showLoginForm = false;
        this.showSignUpForm = false;
        this.showRules = false;
        this.showLogOut = false;
        this.showLoginButton = true;
        this.showSignUpButton = true;
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
        
        // This function makes the signup and login info disappear when someone is logged in
        this.toggle = () => {
            this.showLogOut = !this.showLogOut;
            this.toggleLoginForm();
            this.toggleLoginButton();
            this.toggleSignUpButton();
        };

        this.toggleLoginButton = () => {
            this.showLoginButton = !this.showLoginButton;
        };

        this.toggleSignUpButton = () => {
            this.showSignUpButton = !this.showSignUpButton;
        };

        this.toggleLeaderboard = () => {
            this.showLeaderboard = !this.showLeaderboard;
        };

        this.leaderboardInfo;
        this.submitGetRequest = false;
        // This retrieves the top 10 players from the database
        this.handleLeaderboard = () => {
            if (!this.submitGetRequest) {
                $http({
                    method: 'GET',
                    url: '/api/leaderboards'
                }).then((response) => {
                    this.submitGetRequest = true;
                    this.leaderboardInfo = response.data;
                }, (error) => {
                    console.log(error);
                });
            }
        };
        
        // This sends info to server that someone is logging out
        this.handleLogOut = () => {
            $http({
                method: 'GET',
                url: '/api/logout'
            }).then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        };
        
        this.notLoggedIn = false;
        this.loadPage = false;

        // This checks to see if user is logged in before allowing them to join the game
        this.handleJoinGame = () => {
            $http({
                method: 'GET',
                url: 'api/joingame'
            }).then((response) => {
                console.log(response);
                if (response.data) {
                    this.loadPage = true;
                } else {
                    this.notLoggedIn = true;
                }
            }, error => {
                console.log(error);
            });
        };
    })
    .component('app', {
        bindings : {},
        controller : 'appCtrl',
        templateUrl : './templates/app.html'
    });