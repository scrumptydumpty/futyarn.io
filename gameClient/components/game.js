angular.module('gameinstance')
.controller('gameCtrl', (/*required services go in here*/)=>{
    this.catImage = new Image();
    this.catImage.src = "assets/images/blackCatUp.gif"
    
})
.component('game', {
  bindings : {},
  controller : 'gameCtrl',
  templateUrl : './templates/game.html'
})