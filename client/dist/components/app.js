angular.module('app')

    .controller('appCtrl', function (auth, $http, $scope, $window){
        

        this.showLoginForm = false;
        this.showSignUpForm = false;
        this.showRules = false;
        this.showLogOut = false;
        this.showLoginButton = true;
        this.showSignUpButton = true;
        this.showLeaderboard = false;
        this.user = null;

        this.$onInit = function () {
            this.verifyLogin();
        };


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

        this.toggleLoaded = () => {
            console.log($scope);
            this.loaded = !this.loaded;
            console.log(this.loaded);
            console.log(this);
            $scope.$digest();
        };

        this.toggleLoaded = this.toggleLoaded.bind(this);

        this.leaderboardInfo;
        this.submitGetRequest = false;
        // This retrieves the top 10 players from the database
        this.handleLeaderboard = () => {
            $http({
                method: 'GET',
                url: '/api/leaderboards'
            }).then((response) => {
                this.submitGetRequest = true;
                this.leaderboardInfo = response.data;
            }, (error) => {
                console.log(error);
            });
        };

        this.verifyLogin = () => {
            $http({
                method: 'GET',
                url: '/api/verify'
            })
                .then(response => {
                    if (response.data) {
                        this.user = response.data;
                        this.toggle();
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };
        
        // This sends info to server that someone is logging out
        this.handleLogOut = () => {
            $http({
                method: 'GET',
                url: '/api/logout'
            }).then((response) => {
                console.log(response);
                $window.location.reload();
            }, (error) => {
                console.log(error);
            });
        };
        
        this.notLoggedIn = false;
        this.showGamePage = false;

        this.loaded = false;

        this.randomHash = null;
        const self = this;

        this.handleJoinGame = () => {
            console.log('inside join game function');
            
            
            $http({
                method: 'GET',
                url: 'api/joingame'
            }).then((response) => {
                console.log(response);
                if (response.data) {
                    const {randomHash} = response.data;
                    console.log(randomHash);
                    self.randomHash = randomHash;
                    // Retrieve
                    this.showGamePage = true;
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