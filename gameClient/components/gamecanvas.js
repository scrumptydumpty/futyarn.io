angular.module('gameinstance')
.controller('gamecanvasCtrl', (/*requiered services live here*/) => {

})
.directive('anim', () =>
    {   
         return {
            //Restrict Directive invocation to Attribute on Element
            restrict: "A",
            //Link registers Dom listeners and can update DOM
            //executed after template is cloned
            link : (scope, element, attrs, controller, transcludeFn) =>
                {
    // scope is an AngularJS scope object.
    // element is the jqLite-wrapped element that this directive matches.
    // attrs is a hash object with key-value pairs of normalized attribute names and their corresponding attribute values.
    // controller is the directive's required controller instance(s) or its own controller (if any). The exact value depends on the directive's require property.
    // transcludeFn is a transclude linking function pre-bound to the correct transclusion scope.
                    
    //el[0] === the canvas object we drop the directive on
                    var canvas = element[0]
    //fetch 2d context for canvas to draw
                    var ctx = canvas.getContext('2d')
                    
                    ctx.fillStyle = "LightGreen"
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    //add comment for test
                    var x = 0
                    var y = 0
                    
                    function gameLoop(){
                        window.requestAnimationFrame(gameLoop);
                        drawMe()
                        
                    }
                    
                    function drawMe(){
                        ctx.beginPath();
                        ctx.moveTo(0,0);
                        ctx.lineTo(x,y);
                        ctx.stroke();
                        x ++;
                        y ++;
                    }
                        
                    gameLoop()
                }
            
        }
    })
.component('gamecanvas', {
    bindings : {},
    controller : 'gamecanvasCtrl',
    templateUrl : '/templates/gamecanvas.html'

})