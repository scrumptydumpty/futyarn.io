angular.module('gameinstance')
    .controller('gameCtrl', function (/*required services go in here*/)
    {
        

 	this.socket = io.connect('localhost:1337');

    })
    .component('game', {
        bindings : {},
        controller : 'gameCtrl',
        templateUrl : './templates/game.html'
    });