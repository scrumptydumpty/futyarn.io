angular.module('app')
.controller('appCtrl', (/*required services go in here*/)=>{
 console.log('tryiing out git!')
})
.component('app', {
  bindings : {},
  controller : 'appCtrl',
  templateUrl : './templates/app.html'
})