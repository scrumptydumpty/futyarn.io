angular.module('gameinstance')
.controller('gamecanvasCtrl', (/*requiered services live here*/) => {
    console.log(this)
    this.cat = this.img
    this.canvas;
    this.speed = 5
    this.keyMap = {
            65 : ['right', 0 - this.speed, 68], //L
            68 : ['right', this.speed, 65], //R
            83 : ['down', this.speed, 87 ], //D
            87 : ['down', 0 - this.speed, 83], //U
            32 : [/*TEMPORARY SPEED INCREASE*/]
        }
//map of keycodes to whether or not they're currently pressed                    
        this.keysPressed = {
            65 : false, // "A"-key
            68 : false, //"D" - key
            87 : false, //"W" -key
            83 : false, //"S" -key
            32 : false, //space -key
        } 
//holder for frame to frame variance in location
//right is a postive or negative number (left neg)
//down is a positive or negative number (up neg)
//holder for keypresses
        this.playerVector = {
            currentX : 200,
            currentY : 200,
            right : 0,
            down : 0
            //left : 0 - this.right
            //up : 0 - this.down
        }
    

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
                    
//main draw loop (all draw fucntions live in here)                    
                    function gameLoop(){
                        window.requestAnimationFrame(gameLoop);
                        ctx.clearRect(0,0, canvas.width, canvas.height)
                        ctx.fillStyle = "LightGreen"
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        drawTestRect()
                    }
                    var drawTestRect = function (){
                        ctx.drawImage(this.canvas, playerVector.currentX, playerVector.currentY)
                        playerVector.currentX += playerVector.right;
                        playerVector.currentY += playerVector.down;
                    }
                    
                    
                    var drawPlayerCat = function () {
                        
                    }
                    
//iterate through keys pressed, check for true
//if the key is pressed, change player vector based on keymap
//set depressed keys to zero, unless alternate key is also pressed                    
                    var alterPlayerVector = function (){
                        for (var key in keysPressed){
                            if(this.keysPressed[key]){
                                this.playerVector[this.keyMap[key][0]] = this.keyMap[key][1]; 
                            } else {
                                if(this.keysPressed[this.keyMap[key][2]]){
                                    
                                } else {
                                    this.playerVector[this.keyMap[key][0]] = 0
                                }
                            }
                        }
                    
                    }
//route based on keydown to toggle key press map                    
                    var keyupHandler = function (e){
                        this.keysPressed[e.keyCode] = false;
                        alterPlayerVector();
                    }
//route based on keyup to detoggle key press map
                    var keydownHandler = function(e){
                        this.keysPressed[e.keyCode] = true ;
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
.directive('move', () => 
    {
        return{
            restrict : "A",
            
            link : (scope, element) => 
            {
                this.canvas = element[0]
                var canvas = element[0];
                var ctx = canvas.getContext('2d')

                var pos = this.speed
                var neg = 0 - this.speed
//map between player direction and rotation
                var rotation = {
                    [neg] : {
                        [neg] : 315,
                        0  : 270,
                        [pos]  : 225
                    },
                    0 : {
                        [neg] : 0,
                        0  : 0,
                        [pos]  : 180
                    },
                    [pos] : {
                        [neg] : 45,
                        0 : 90,
                        [pos] : 135
                    }
                    
                }
                
                console.log(this.cat)
                
                function gameLoop(){
                        window.requestAnimationFrame(gameLoop);
                        ctx.clearRect(0,0,canvas.height, canvas.width)
                        var spin = rotation[this.playerVector.right][this.playerVector.down]
                        ctx.translate(canvas.width/2, canvas.height/2)
                        ctx.rotate(spin*Math.PI / 180)
                        ctx.drawImage(this.catImage,0,0,25,60,-12,-20,25,60)
                        // ctx.drawImage(this.catImage,0,0,25,60,-12,-30,25,60)
                        ctx.rotate((0 - spin)*Math.PI / 180)
                        ctx.translate(-canvas.width/2, -canvas.height/2)
                    }
                
                    
                gameLoop()
                angular.element(window).on('keydown')
                angular.element(window).on('keyup')
            }
            
        }   
        
    })
.component('gamecanvas', {
    bindings : {
        img : '=' 
    },
    controller : 'gamecanvasCtrl',
    templateUrl : '/templates/gamecanvas.html'

})