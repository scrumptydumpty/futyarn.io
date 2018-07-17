angular.module('app')
.controller('signUpCtrl', (/*login/signup service*/) => {
  this.username = 'tony'
  this.password = 'tonyRules!'
})
.component('signUp', {
  bindings : {},
  controller : 'signUpCtrl',
  templateUrl : '/templates/sign-up.html'

})