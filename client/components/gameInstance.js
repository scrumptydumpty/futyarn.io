// we might want to serve this page from another server, behind the join game wall
//and use join game menu button as a way to route ppl to game server;

angular.module('app')
.controller('gameCtrl', (/*requiered services live here*/) => {

})
.component('gameInstance', {
  bindings : {},
  controller : 'gameCtrl',
  templateUrl : '/templates/gameInstance.html'

})