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
    //temp global object for player speed                
                    var speed = 5; 
                    
                    ctx.fillStyle = "LightGreen"
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    
//main draw loop (all draw fucntions live in here)                    
                    function gameLoop(){
                        window.requestAnimationFrame(gameLoop);
                    }
                    
//holder for frame to frame variance in location
//right is a postive or negative number (left neg)
//down is a positive or negative number (up neg)
//holder for keypresses
                    var playerVector = {
                        currentX : 0,
                        currentY : 0,
                        right : 0,
                        down : 0
                        //left : 0 - this.right
                        //up : 0 - this.down
                    }
//iterate through keys pressed, check for true
//if the key is pressed, change player vector based on keymap
//set depressed keys to zero, unless alternate key is also pressed                    
                    var alterPlayerVector = function (){
                        for (var key in keysPressed){
                            if(keysPressed[key]){
                                playerVector[keyMap[key][0]] = keyMap[key][1]; 
                            } else {
                                if(keysPressed[keyMap[key][2]]){
                                    
                                } else {
                                    playerVector[keyMap[key][0]] = 0
                                }
                            }
                        }
                        console.log(playerVector)
                    }
//map keys pressed to player vector keys, with speeds at index one
                    var keyMap = {
                        65 : ['right', 0 - speed, 68], //L
                        68 : ['right', speed, 65], //R
                        83 : ['down', speed, 87 ], //D
                        87 : ['down', 0 - speed, 83], //U
                        32 : [/*TEMPORARY SPEED INCREASE*/]
                    }
//map of keycodes to whether or not they're currently pressed                    
                    var keysPressed = {
                        65 : false, // "A"-key
                        68 : false, //"D" - key
                        87 : false, //"W" -key
                        83 : false, //"S" -key
                        32 : false, //space -key
                    } 
//route based on keydown to toggle key press map                    
                    var keyupHandler = function (e){
                        keysPressed[e.keyCode] = false;
                        alterPlayerVector();
                    }
//route based on keyup to detoggle key press map
                    var keydownHandler = function(e){
                        keysPressed[e.keyCode] = true ;
                        alterPlayerVector();
                    }
//add global event listeners that rout to the kepress routers
                    angular.element(window).on('keydown', keydownHandler)
                    angular.element(window).on('keyup', keyupHandler)

//call the main draw loop
                    gameLoop()
                }
            
        }
    })
.component('gamecanvas', {
    bindings : {},
    controller : 'gamecanvasCtrl',
    templateUrl : '/templates/gamecanvas.html'

})