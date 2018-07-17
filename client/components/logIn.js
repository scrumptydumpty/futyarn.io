angular.module('app')
.controller('logInCtrl', (/*LogIN/Signup service*/) => {
  this.username = 'tony'
  this.password = 'tonyRules!'
})
.component('logIn', {
  bindings : {},
  controller : 'logInCtrl',
  templateUrl : '/templates/log-in.html'

})