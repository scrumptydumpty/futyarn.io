angular.module('gameinstance')
    .controller('gamecanvasCtrl', function () 
    {
        this.mouse = {
            x : 0,
            y: 0
        };
        this.initTime = Date.now();
        this.img = this.teamoneimg;
        this.isLoading = true;
        this.canvas;
        this.opponents;
        this.speed = 0.294;
        this.keyMap = {
            65 : ['right', 0 - this.speed, 68], //L
            68 : ['right', this.speed, 65], //R
            83 : ['down', this.speed, 87 ], //D
            87 : ['down', 0 - this.speed, 83], //U
            32 : [/*TEMPORARY SPEED INCREASE*/]
        };
        //map of keycodes to whether or not they're currently pressed                    
        this.keysPressed = {
            65 : false, // "A"-key
            68 : false, //"D" - key
            87 : false, //"W" -key
            83 : false, //"S" -key
            32 : false, //space -key
        }; 
        //holder for frame to frame variance in location
        //right is a postive or negative number (left neg)
        //down is a positive or negative number (up neg)
        //holder for keypresses
        this.playerVector = {
            currentX : 200,
            currentY : 200,
            right : 0,
            down : 0,
            spacePressed: false,
            rotation: 0,
            id : 'unassigned',
            index: -1
        };

        this.playerRotations = [0,0,0,0];

        this.goals = {
            team1 : 0,
            team2 : 0
        };
        
        this.tempBallVector = {
            cx : 600,
            cy : 0,
            dx : 0,
            dy  : .4,
        };
        var pos = this.speed;
        var neg = 0 - this.speed;
            
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
        
        };

        this.mouseoverHandler = function (e)
        {
        // console.log($event)
        //console.log(e)
            if (this.isLoading){
                this.mouse.x = e.originalEvent.layerX;
                this.mouse.y = e.originalEvent.layerY;
            }
        };

        var context = this;

        this.spin = function () 
        {
            return context.rotation[context.playerVector.right][context.playerVector.down];
        };

        this.resetBall = function () 
        {
            this.tempBallVector.currentX = 600;
            this.tempBallVector.currentY = 325;
            this.tempBallVector.right = 0;
            this.tempBallVector.down = 0;
        };

        this.shouldRender = function () 
        {
            console.log(this.cache.shouldStart);
            return this.cache.shouldStart;

        }; 


                
    })
    .directive('anim', function()
    {   
        return {
            //Restrict Directive invocation to Attribute on Element
            restrict: 'A',
            //Link registers Dom listeners and can update DOM
            //executed after template is cloned
            link : (scope, element, attrs, controller, transcludeFn) =>
            {
                // scope is an AngularJS scope object.
                // element is the jqLite-wrapped element that this directive matches.
                // attrs is a hash object with key-value pairs of normalized attribute names and their corresponding attribute values.
                // controller is the directive's required controller instance(s) or its own controller (if any). The exact value depends on the directive's require property.
                // transcludeFn is a transclude linking function pre-bound to the correct transclusion scope.
                    
                var ctrl = scope.$ctrl;
                //el[0] === the canvas object we drop the directive on
                var canvas = element[0];
                //fetch 2d context for canvas to draw
                var ctx = canvas.getContext('2d');
                //temp global object for player speed                
                var speed = 5; 
                var otherPlayers =[];
                var shouldStart = false;
                var lastTime = Date.now();
                var thisTime = Date.now();
                var framecount = 0;

                const colorArray = [
                    '#35AFD8',
                    '#327ECE',
                    '#39C1BF',
                    '#35D8A7',
                    '#32CE74'
                ];
                //main draw loop (all draw fucntions live in here)                    
                function gameLoop()
                {
                    thisTime = Date.now();
                    var cache = ctrl.cache;
                    if (!ctrl.isLoading){
                        window.requestAnimationFrame(gameLoop);
                    } else {
                        window.requestAnimationFrame(loadingLoop);
                    }
                    ctx.clearRect(0,0, canvas.width, canvas.height);
                    ctx.fillStyle = 'LightGreen';
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    ctx.font = '40px Arial';
                    // console.log(ctrl.cache)
                    ctx.fillStyle = 'white';
                    ctx.fillText(`${ctrl.cache.score.teamTwo} : ${ctrl.cache.score.teamOne}`,561, 40);
                    ctx.fillRect(50,0,4,650);
                    ctx.fillRect(1146,0,4,650);
                    ctx.fillRect(598,0,4,650);
                    ctx.beginPath();
                    ctx.arc(600,325 , 75, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                    drawBall();
                    drawTestCat();
                    isCatBallCollision();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0,250, 50, 150);
                    ctx.fillRect(1150,250,50,150);
                    scope.$digest();
                    ctrl.playerVector.updateTime = Date.now();
                    lastTime = Date.now();
                    // console.log(ctrl.initcache)
                }


                var Particle = function(x, y, radius, color) {
                    this.x = x;
                    this.y = y;
                    this.radius = radius;
                    this.color = color;
                    this.radians = Math.random() * Math.PI * 2;
                    this.angularVelocity = 0.05;
                    this.distanceFromCenter = Math.floor(Math.random() * (120 - 50 + 1) + 50);
                    this.lastMouse = {x: this.x, y: this.y};

                    this.draw = function(lastPoint) {
                        ctx.beginPath();
                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = this.radius;
                        ctx.moveTo(lastPoint.x, lastPoint.y);
                        ctx.lineTo(this.x, this.y);
                        ctx.stroke();
                        ctx.closePath();
                    };
                
                    this.update = function() {
                        const lastPoint = {x: this.x, y:this.y};
                        this.radians += this.angularVelocity;
                        this.lastMouse.x += (ctrl.mouse.x - this.lastMouse.x) * 0.05;
                        this.lastMouse.y += (ctrl.mouse.y - this.lastMouse.y) * 0.05;
                        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
                        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
                        this.draw(lastPoint);
                    };
                };

                const particles = [];
                const init = function() {
                    for (let i = 0; i < 50; i++) {
                        const radius = (Math.random() * 2) + 2.5;
                        particles.push(new Particle(canvas.width/2, canvas.height/2, radius, randomColor(colorArray)));
                    }  
                };

                const randomColor = function (colors) {
                    return colors[Math.floor(Math.random() * colors.length)];
                };


                var loadingLoop = function ()
                {
                    if (ctrl.isLoading){
                        window.requestAnimationFrame(loadingLoop);
                    } else {
                        window.requestAnimationFrame(gameLoop);
                    }
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
                    ctx.fillRect(0,0,canvas.width, canvas.height);
                    particles.forEach((particle) => 
                    {
                        particle.update();
                    });

                };



                var drawTestCat = function ()
                {
                    //console.log(otherPlayers.length)
                    var frameTimeDelta = thisTime - lastTime;
                    if (shouldStart){
                        otherPlayers.forEach((playerCanvas, index)=>{
                            if(index !== ctrl.playerVector.index){
                                // console.log(playerCanvas[0])
                                ctx.drawImage(playerCanvas[0], ctrl.cache.players[index].currentX, ctrl.cache.players[index].currentY);
                                ctrl.cache.players[index].currentX += (ctrl.cache.players[index].right * frameTimeDelta);
                                ctrl.cache.players[index].currentY += (ctrl.cache.players[index].down  * frameTimeDelta);
                            }
                        });}
                    ctx.drawImage(ctrl.canvas, ctrl.playerVector.currentX, ctrl.playerVector.currentY);
                    ctrl.playerVector.currentX += (ctrl.playerVector.right * frameTimeDelta);
                    ctrl.playerVector.currentY += (ctrl.playerVector.down  * frameTimeDelta);
                };
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
                    };
                    var currentCenterX = ctrl.playerVector.currentX + hitBoxMap[ctrl.spin()][0];
                    var currentCenterY = ctrl.playerVector.currentY + hitBoxMap[ctrl.spin()][1];
                    var ball = ctrl.tempBallVector;
                    var ballCenterX = ball.cx +5;
                    var ballCenterY = ball.cy +5;
                        
                        
                    var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY),2));
                    // console.log(ballCenterDelta)
                    return (ballCenterDelta < 11);
                };

                var isCatBodyCollision = function (){
                    var currentCenterX = ctrl.playerVector.currentX + 50;
                    var currentCenterY = ctrl.playerVector.currentY + 50;
                    var ball = ctrl.tempBallVector;
                    var ballCenterX = ball.cx +5;
                    var ballCenterY = ball.cy +5;
                        
                        
                    var ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - currentCenterX), 2) + Math.pow((ballCenterY - currentCenterY),2));
                    return (ballCenterDelta < 12);
                }; 
                    
                var getKickDirection = function (){
                    var map = {
                        0   : [0,-.502],
                        45  : [.502,-.502],
                        90  : [.502,0],
                        135 : [.502,.502],
                        180 : [0,.502],
                        225 : [-.502,.502],
                        270 : [-.502,0],
                        315 : [-.502,-.502]
                    };
                    var arr = map[ctrl.spin()];
                    const xdiff = (Math.floor(Math.random() * 300) - 150) / 1000;
                    const ydiff = (Math.floor(Math.random() * 300) - 150) / 1000;
                    arr[0] += xdiff;
                    arr[1] += ydiff; 
                    return arr;
                };
                    
                var drawBall = function () 
                {
                    var timeDelta  = thisTime - lastTime;
                    var ball = ctrl.tempBallVector;                    
                    // console.log(ctrl.cache.ballLoc);
                    // var ball = ctrl.cache.ballLocx                   var playerX = ctrl.playerVector.currentX;
                    var playerY = ctrl.playerVectordyrentY;
                    var ballX = ball.cx;
                    var ballY = ball.cy;
                    var bounce = isWallBounce();
                    ctx.beginPath();
                    ctx.arc(ball.cx, ball.cy, 7, 0, 2 * Math.PI, false);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#8b0000';
                    ctx.stroke();
                        
                    // console.log(ball.cx)
                    if (bounce){
                        if (bounce === 'x'){
                            ball.cx -= ((2 * ball.dx) * timeDelta);
                            ball.dx -= (2 * (ball.dx));
                        } else if (bounce === 'y'){
                            ball.cy -= ((2 * ball.dy) * timeDelta);
                            ball.dy  -= (2 * (ball.dy));
                        } else if (bounce === '1'){
                            ctrl.goals.team1 += 1;
                            ctrl.resetBall();
                        } else if (bounce === '2'){
                            ctrl.goals.team2 += 1;
                            ctrl.resetBall();
                        }                        
                    }
                    ball.cx += ball.dx * timeDelta;
                    ball.cy += ball.dy  * timeDelta;
                    if (Math.abs(ball.dx) > 0.02){
                        if (ball.dx > 0) {
                            ball.dx -= .0021;
                        } else {
                            ball.dx += .0021;
                        }
                    } else {
                        ball.dx = 0;
                    }
                    if (Math.abs(ball.dy) > 0.02){
                        if (ball.dy > 0){
                            ball.dy -= .0021;
                        } else {
                            ball.dy += .0021;
                        }
                    } else {
                        ball.dy = 0;
                    }
                    if (isCatBallCollision()){
                        // console.log(ball.dx)
                        ball.dx += (1.05 * (ctrl.playerVector.right) - ball.dx); 
                        ball.dy += (1.05 *(ctrl.playerVector.down) - ball.dy);
                        if (ctrl.keysPressed[32]){
                            var kick = getKickDirection();
                            ctrl.tempBallVector.dx = kick[0];
                            ctrl.tempBallVector.cx += (3 * kick[0]);
                            ctrl.tempBallVector.dy = kick[1];
                            ctrl.tempBallVector.cy += (3 * kick[1]);
                            //console.log(ctrl.tempBallVector);
                        }
                    } else if (isCatBodyCollision()) {
                        ball.dx += (1.1 * (ctrl.playerVector.right) - ball.dx); 
                        ball.dy += (1.1 *(ctrl.playerVector.down) - ball.dy);
                    }
                };

                var isWallBounce = function() 
                {
                    var ball = ctrl.tempBallVector;
                    var playerX = ctrl.playerVector.currentX;
                    var playerY = ctrl.playerVector.currentY;
                    var ballX = ball.cx;
                    var ballY = ball.cy;
                    // console.log(ball.cx , ball.cy)
                    if (ballY > 250 && ballY < 400){
                        if (ballX < 55){
                            return '1';
                        } else if (ballX > (canvas.width - 55)){
                            return '2';
                        }
                    }
                    if (ballX < 55|| ballX > (canvas.width - 55)){
                        return 'x';
                    } 
                    if (ballY < 0 || ballY > (canvas.height - 10)){
                        return 'y'; 
                    }
                    return false;
                };
                    
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
                                ctrl.playerVector[ctrl.keyMap[key][0]] = 0;
                            }
                        }
                    }
                    
                };
                //route based on keydown to toggle key press map                    
                var keyupHandler = function (e){
                    if (ctrl.keysPressed[e.keyCode] === undefined) return;
                    if (e.keyCode === 32){
                        ctrl.playerVector.spacePressed = false;
                    }
                    ctrl.keysPressed[e.keyCode] = false;
                    alterPlayerVector();
                };
                //route based on keyup to detoggle key press map
                var keydownHandler = function(e){
                    if (ctrl.keysPressed[e.keyCode] === undefined) return;
                    if (e.keyCode === 32){
                        ctrl.playerVector.spacePressed = true;
                    }
                    ctrl.keysPressed[e.keyCode] = true ;
                    alterPlayerVector();
                };
                //add global event listeners that rout to the kepress routers
                angular.element(window).on('keydown', keydownHandler);
                angular.element(window).on('keyup', keyupHandler);

                ctrl.socket.on('cache', (msg) => {
   
                    ctrl.cache = msg;
                    ctrl.tempBallVector = msg.ballLoc;
                    msg.players.forEach((player, index)=>{
                        ctrl.playerRotations[index] = msg.players[index].rotation;
                    });
                    ctrl.socket.emit('uploadplayervector', ctrl.playerVector);
                });

                ctrl.socket.on('you', (msg) => {
                    var data = msg;
                    ctrl.playerVector.id = data[0];
                    ctrl.playerVector.index = data[1];
                    //console.log(ctrl.playerVector);
                    //console.log(msg[0]);
                });

                ctrl.socket.on('initGame', ()=>{
                    ctrl.isLoading = false;
                    var index = ctrl.playerVector.index;
                    otherPlayers = [];
                    for (var i = 0; i < 4; i++){
                        console.log(angular.element(document.querySelector(`#oppCat${i}`)));
                        otherPlayers.push(angular.element(document.querySelector(`#oppCat${i}`)));
                    }
                    shouldStart = true;
                    console.log(otherPlayers);
                    
                });

                //call the main draw loop
                // setInterval( gameLoop, 15)
                init();
                gameLoop();

            }
            
        };
    })
    .directive('move', function() 
    {
        return{
            restrict : 'A',
            
            link : (scope, element) => 
            {
                var ctrl = scope.$ctrl;
          
                ctrl.canvas = element[0];
                var canvas = element[0];
                console.log(canvas);
                var ctx = canvas.getContext('2d');

                var pos = ctrl.speed;
                var neg = 0 - ctrl.speed;
                //map between player direction and rotation
            
                
   
                //refactor to not loop?                
                function gameLoop()
                {
                    window.requestAnimationFrame(gameLoop);
                    ctx.clearRect(0,0,canvas.height, canvas.width);
                    var spin = ctrl.rotation[ctrl.playerVector.right][ctrl.playerVector.down];
                    ctrl.rotation[0][0] = spin;
                    ctrl.playerVector.rotation = spin;
                    ctx.translate(canvas.width/2, canvas.height/2);
                    ctx.rotate(spin*Math.PI / 180);
                    if (ctrl.playerVector.index <= 1 ) {
                        ctx.drawImage(ctrl.teamoneimg,0,0,25,60,-14,-20,25,60);
                    } else {
                        ctx.drawImage(ctrl.teamtwoimg,0,0,25,60,-14,-20,25,60);
                    }
                    ctx.rotate((0 - spin)*Math.PI / 180);
                    ctx.translate(-canvas.width/2, -canvas.height/2);
                }   
                gameLoop();
                angular.element(window).on('keydown');
                angular.element(window).on('keyup');
            }
            
        };   
        
    })
    .component('gamecanvas', {
        bindings : {
            teamoneimg : '=',
            teamtwoimg: '=', 
            socket: '=',
            cache : '=',
            initcache : '='
        },
        controller : 'gamecanvasCtrl',
        templateUrl : './templates/gamecanvas.html'

    });