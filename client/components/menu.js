angular.module('app')
    .controller('menuCtrl', function () {
        console.log('hello from menu js');
        this.showLoginForm = false;
        this.showSignUpForm = false;
        this.showRules = false;
        this.showLogOut = false;
        this.showLoginButton = false;

        this.toggleLoginForm = () => {
            if (this.showLoginForm) {
                this.showLoginForm = false;
            } else {
                this.showLoginForm = true;
            }
        };

        this.toggleSignUpForm = () => {
            if (this.showSignUpForm) {
                this.showSignUpForm = false;
            } else {
                this.showSignUpForm = true;
            }
        };

        this.toggleRules = () => {
            if (this.showRules) {
                this.showRules = false;
            } else {
                this.showRules = true;
            }
        };

        this.toggle = () => {
            console.log('toggle pressed');
            if (this.showLogOut) {
                this.showLogOut = false;
                this.toggleLoginForm();
            } else {
                this.showLogOut = true;
                this.toggleLoginForm();
            }
        };

        this.toggleLoginButton = () => {
            if (this.showLoginButton) {
                this.showLoginButton = false;
            } else {
                this.showLoginButton = true;
            }
        };
    })
    .component('menu', {
        bindings : {
        },
        controller : 'menuCtrl',
        templateUrl : '/templates/menu.html'

    });