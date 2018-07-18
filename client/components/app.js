angular.module('app')
    .controller('appCtrl', (/*required services go in here*/)=>{
        console.log('Hello from app js!');
    })
    .component('app', {
        bindings : {},
        controller : 'appCtrl',
        templateUrl : './templates/app.html'
    });