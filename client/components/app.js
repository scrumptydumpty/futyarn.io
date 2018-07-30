angular.module('app')
    .controller('appCtrl', function (auth, $http, $scope){
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
            console.log($scope)
            this.loaded = !this.loaded;
            console.log(this.loaded)
            console.log(this)
            $scope.$digest()
        }

        this.toggleLoaded = this.toggleLoaded.bind(this)

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

        this.handleLogOut = () => {
            console.log('inside handle log out function');
            $http({
                method: 'GET',
                url: '/api/logout'
            }).then((response) => {
                console.log(response);
                console.log('you logged out!');
            }, (error) => {
                console.log(error);
            });
        };
        
        this.notLoggedIn = false;
        this.loadPage = false;
        this.loaded = false;



        this.handleJoinGame = () => {
            console.log('inside join game function');
            this.socket = io.connect('http://localhost:1337')   
            $http({
                method: 'GET',
                url: 'api/joingame'
            }).then((response) => {
                console.log(response);
                if (response.data) {
                    this.loadPage = true;
                    // console.log('you are inside the first if statement')
                } else {
                    this.notLoggedIn = true;
                }
            }, error => {
                console.log(error);
                // this.notLoggedIn = true;
            });
        };
    })
    .component('app', {
        bindings : {},
        controller : 'appCtrl',
        templateUrl : './templates/app.html'
    });