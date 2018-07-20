angular.module('gameinstance')
.controller('gamecanvasCtrl', function (/*requiered services live here*/) 
{
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
    this.goals = {
        team1 : 0,
        team2 : 0
    }
        
    this.tempBallVector = {
        currentX : 600,
        currentY : 0,
        right : 0,
        down  : 4.76,
    }
    var pos = this.speed
    var neg = 0 - this.speed
            
//map player vector to rotation in degrees           
    this.rotation = {
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
    this.mouseoverHandler = function (e){
        console.log('X. ' + e.originalEvent.layerX)
        console.log('Y. ' + e.originalEvent.layerY)
    }
    var context = this
    this.spin = function () {
        return context.rotation[context.playerVector.right][context.playerVector.down]
    }
    this.resetBall = function () {
        this.tempBallVector.currentX = 600
        this.tempBallVector.currentY = 325
        this.tempBallVector.right = 0
        this.tempBallVector.down = 0
    } 
                
})
.directive('anim', function()
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
                    var ctrl = scope.$ctrl
    //el[0] === the canvas object we drop the directive on
                    var canvas = element[0]
    //fetch 2d context for canvas to draw
                    var ctx = canvas.getContext('2d')
    //temp global object for player speed                
                    var speed = 5; 
                    
//main draw loop (all draw fucntions live in here)                    
                    function gameLoop()
                    {
                        window.requestAnimationFrame(gameLoop);
                        ctx.clearRect(0,0, canvas.width, canvas.height)
                        ctx.fillStyle = "LightGreen"
                        ctx.fillRect(0,0,canvas.width,canvas.height);
                        ctx.font = "40px Arial"
                        
                        ctx.fillStyle = "white"
                        ctx.fillText(`${ctrl.goals.team2} : ${ctrl.goals.team1}`,561, 40)
                        ctx.fillRect(50,0,4,650)
                        ctx.fillRect(1146,0,4,650)
                        ctx.fillRect(598,0,4,650)
                        ctx.beginPath();
                        ctx.arc(600,325 , 75, 0, 2 * Math.PI, false)
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = 'white'
                        ctx.stroke();
                        drawBall()
                        drawTestCat()
                        isCatBallCollision()
                        ctx.fillStyle = "white"
                        ctx.fillRect(0,250, 50, 150)
                        ctx.fillRect(1150,250,50,150)
                    }
                    var drawTestCat = function ()
                    {
                        ctx.drawImage(ctrl.canvas, ctrl.playerVector.currentX, ctrl.playerVector.currentY)
                        ctrl.playerVector.currentX += ctrl.playerVector.right;
                        ctrl.playerVector.currentY += ctrl.playerVector.down;
                    }
                    var isCatBallCollision = function ()
                    {
                        var hitBoxMap = {
                            0   : [50,45],
                            45  : [56,48],
                            90  : [60,55],
                            135 : [56,58],
                            180 : [50,62],
                            225 : [44,58],
                            270 : [40,55],
                            315 : [44,48],
                        }
                        var currentCenterX = ctrl.playerVector.currentX + hitBoxMap[ctrl.spin()][0]
                        var currentCenterY = ctrl.playerVector.currentY + hitBoxMap[ctrl.spin()][1]
                        var ball = ctrl.tempBallVector
                        var ballCenterX = ball.currentX +5
                        var ballCenterY = ball.currentY +5
                        
                        
                        var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY),2))
                        // console.log(ballCenterDelta)
                        return (ballCenterDelta < 11)
                    }
                    var isCatBodyCollision = function (){
                         var currentCenterX = ctrl.playerVector.currentX + 50
                        var currentCenterY = ctrl.playerVector.currentY + 50
                        var ball = ctrl.tempBallVector
                        var ballCenterX = ball.currentX +5
                        var ballCenterY = ball.currentY +5
                        
                        
                        var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY),2))
                        return (ballCenterDelta < 12)
                    } 
                    
                    var getKickDirection = function (){
                       var map = {
                           0   : [0,-9],
                           45  : [9,-9],
                           90  : [9,0],
                           135 : [9,9],
                           180 : [0,9],
                           225 : [-9,9],
                           270 : [-9,0],
                           315 : [-9,-9]
                       }
                       return map[ctrl.spin()]
                    }
                    
                    var drawBall = function () 
                    {
                        var ball = ctrl.tempBallVector;
                        var playerX = ctrl.playerVector.currentX;
                        var playerY = ctrl.playerVector.currentY;
                        var ballX = ball.currentX;
                        var ballY = ball.currentY;
                        var bounce = isWallBounce()
                        ctx.beginPath();
                        ctx.arc(ball.currentX, ball.currentY, 7, 0, 2 * Math.PI, false)
                        ctx.fillStyle = 'red';
                        ctx.fill()
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = '#8b0000'
                        ctx.stroke();
                        
                        // console.log(ball.currentX)
                        if (bounce){
                            if (bounce === 'x'){
                                ball.currentX -= (2 * ball.right)
                                ball.right -= (2 * (ball.right))
                            } else if (bounce === 'y'){
                                ball.currentY -= (2 * ball.down)
                                ball.down  -= (2 * (ball.down))
                            } else if (bounce === '1'){
                                ctrl.goals.team1 += 1
                                ctrl.resetBall()
                            } else if (bounce === '2'){
                                ctrl.goals.team2 += 1
                                ctrl.resetBall()
                            }                        
                        }
                        ball.currentX += ball.right
                        ball.currentY += ball.down
                        if (Math.abs(ball.right) > 0.25){
                            if (ball.right > 0) {
                                ball.right -= .035
                            } else {
                                ball.right += .035
                            }
                        } else {
                            ball.right = 0
                        }
                        if (Math.abs(ball.down) > 0.25){
                            if (ball.down > 0){
                                ball.down -= .035
                            } else {
                                ball.down += .035
                            }
                        } else {
                            ball.down = 0
                        }
                        if (isCatBallCollision()){
                            // console.log(ball.right)
                            ball.right += (ctrl.playerVector.right - ball.right)
                            ball.down += (ctrl.playerVector.down - ball.down)
                            if (ctrl.keysPressed[32]){
                                var kick = getKickDirection()
                                ctrl.tempBallVector.right = kick[0]
                                ctrl.tempBallVector.currentX += (3 * kick[0])
                                ctrl.tempBallVector.down = kick[1]
                                ctrl.tempBallVector.currentY += (3 * kick[1])
                                console.log(ctrl.tempBallVector)
                            }
                        } else if (isCatBodyCollision()) {
                            ball.right -= (2 * (ball.right)) 
                            ball.down -= (2 * (ball.down)) 
                        }
                    }

                    var isWallBounce = function() {
                        var ball = ctrl.tempBallVector;
                        var playerX = ctrl.playerVector.currentX;
                        var playerY = ctrl.playerVector.currentY;
                        var ballX = ball.currentX;
                        var ballY = ball.currentY;
                        // console.log(ball.currentX , ball.currentY)
                        if (ballY > 250 && ballY < 400){
                            if (ballX < 55){
                                return '1'
                            } else if (ballX > (canvas.width - 55)){
                                return '2'
                            }
                        }
                        if (ballX < 55|| ballX > (canvas.width - 55)){
                            return 'x'
                        } 
                        if (ballY < 0 || ballY > (canvas.height - 10)){
                            return 'y' 
                        }
                        return false;
                        }
                    
//iterate through keys pressed, check for true
//if the key is pressed, change player vector based on keymap
//set depressed keys to zero, unless alternate key is also pressed                    
                    var alterPlayerVector = function (){
                        for (var key in ctrl.keysPressed){
                            if(ctrl.keysPressed[key]){
                                ctrl.playerVector[ctrl.keyMap[key][0]] = ctrl.keyMap[key][1]; 
                            } else {
                                if(ctrl.keysPressed[ctrl.keyMap[key][2]]){
                                    
                                } else {
                                    ctrl.playerVector[ctrl.keyMap[key][0]] = 0
                                }
                            }
                        }
                    
                    }
//route based on keydown to toggle key press map                    
                    var keyupHandler = function (e){
                        if (ctrl.keysPressed[e.keyCode] === undefined) return;
                        ctrl.keysPressed[e.keyCode] = false;
                        alterPlayerVector();
                    }
//route based on keyup to detoggle key press map
                    var keydownHandler = function(e){
                        if (ctrl.keysPressed[e.keyCode] === undefined) return;
                        ctrl.keysPressed[e.keyCode] = true ;
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
.directive('move', function() 
    {
        return{
            restrict : "A",
            
            link : (scope, element) => 
            {
                var ctrl = scope.$ctrl
                console.log(ctrl)
                ctrl.canvas = element[0]
                var canvas = element[0];
                var ctx = canvas.getContext('2d')

                var pos = ctrl.speed
                var neg = 0 - ctrl.speed
//map between player direction and rotation
            
                
                console.log(ctrl.cat)
                
                function gameLoop(){
                        window.requestAnimationFrame(gameLoop);
                        ctx.clearRect(0,0,canvas.height, canvas.width)
                        var spin = ctrl.rotation[ctrl.playerVector.right][ctrl.playerVector.down]
                        ctrl.rotation[0][0] = spin
                        ctx.translate(canvas.width/2, canvas.height/2)
                        ctx.rotate(spin*Math.PI / 180)
                        ctx.drawImage(ctrl.img,0,0,25,60,-14,-20,25,60)
                        // ctx.drawImage(this.catImage,0,0,25,60,-12,-30,25,60)
                        ctx.rotate((0 - spin)*Math.PI / 180)
                        ctx.translate(-canvas.width/2, -canvas.height/2)
                    }
                
                // canvas.on('mouseover', function(e){
                //     console.log(e.target.value)
                // })    
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