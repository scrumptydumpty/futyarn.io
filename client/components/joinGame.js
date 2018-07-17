//might wanna build out the join game stuff from a game server, and serve it from another static html page, 
//and use the button o the menu page to route ppl to that other server;

angular.module('app')
.controller('joinGameCtrl', (/*requiered services live here*/) => {

})
.component('joinGame', {
  bindings : {},
  controller : 'joinGameCtrl',
  templateUrl : '/templates/join-game.html'

})