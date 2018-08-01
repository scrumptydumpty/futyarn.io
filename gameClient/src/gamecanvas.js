const { Ball }  = require('../../shared/Ball');
const { Player } = require('../../shared/Player');
const { TICK } = require('../../shared/gamelogic');
angular.module('gameinstance')
    .controller('gamecanvasCtrl', function () 
    {
        this.img1 = new Image();
        this.img1.src = '/images/BlackCatUp.gif';
        this.img2 = new Image();
        this.img2.src = '/images/orangeCatSpriteUp.gif';

        this.isLoading = true;
        this.canvas;

        this.lastDraw;

        //map of keycodes to whether or not they're currently pressed                     	
        this.score = {
            1:0,
            2:0
        };
        this.keysPressed = {
            65 : false, // "A"-key
            68 : false, // "D" - key
            87 : false, // "W" -key
            83 : false, // "S" -key
            32 : false, // space -key
        }; 
        //holder for frame to frame variance in location
        //right is a postive or negative number (left neg)
        //down is a positive or negative number (up neg)
        //holder for keypresses
        this.playerId = null; 

        this.players = {};

        this.ball = new Ball();
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
                //console.log(ctrl);
                //el[0] === the canvas object we drop the directive on
                var canvas = element[0];
                //fetch 2d context for canvas to draw
                var ctx = canvas.getContext('2d');
                //temp global object for player speed
               
                var shouldStart = false;

                const colorArray = [
                    '#35AFD8',
                    '#327ECE',
                    '#39C1BF',
                    '#35D8A7',
                    '#32CE74'
                ];
                //main draw loop (all draw fucntions live in here)                    
                var gameLoop = function ()
                {
                    //console.log('rendering');
                    if (!ctrl.isLoading){
                        //window.requestAnimationFrame(gameLoop);
                    } else {
                        
                        // window.requestAnimationFrame(loadingLoop);
                    }
                    //console.log('rendering2');
                    ctx.clearRect(0,0, canvas.width, canvas.height);
                    ctx.fillStyle = 'LightGreen';
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    ctx.font = '40px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(`${ctrl.score[1]} : ${ctrl.score[2]}`,561, 40);
                    ctx.fillRect(50,0,4,650);
                    ctx.fillRect(1146,0,4,650);
                    ctx.fillRect(598,0,4,650);
                    ctx.beginPath();
                    ctx.arc(600,325 , 75, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'white';
                    ctx.stroke();
                    ctrl.ball.draw(ctx);
                    drawPlayers();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0,250, 50, 150);
                    ctx.fillRect(1150,250,50,150);
                    ctrl.ball.move();
                    //scope.$digest();
                    
                };

                var drawPlayers = function ()
                {   
                    if (shouldStart){
                        const keys = Object.keys(ctrl.players);
                        
                        keys.forEach(key=>{
                            ctrl.players[key].draw(ctx);
                        });
                    }

                    //ctx.drawImage(ctrl.canvas, ctrl.player.x, ctrl.player.y);
                    // ctrl.player.currentX += (ctrl.player.right * frameTimeDelta);
                    // ctrl.player.currentY += (ctrl.player.down  * frameTimeDelta);
                };
                
                //iterate through keys pressed, check for true
                //if the key is pressed, change player vector based on keymap
                //set depressed keys to zero, unless alternate key is also pressed                    
                var alterPlayer = function (){

                    const k = ctrl.keysPressed;
                    const p = ctrl.players[ctrl.playerId];
                    console.log('id', ctrl.playerId,'players',ctrl.players,'player', p);
                    let r = p.rotation;
                    if (k[65] && k[87]) {
                        r = 3;
                    } else if (k[87] && k[68]) {
                        r = 1;
                    } else if (k[68] && k[83]) {
                        r = 7;
                    } else if (k[83] && k[65]) {
                        r = 5;
                    } else if (k[87]) {
                        r = 2;
                    } else if (k[68]) {
                        r = 0;
                    } else if (k[83]) {
                        r = 6;
                    } else if (k[65]) {
                        r = 4;
                    }
                  
                    p.handleRotation(r);
                    p.transmit(ctrl.socket);
                    
                };
                //route based on keydown to toggle key press map                    
                var keyupHandler = function (e){
                   
                    if (ctrl.keysPressed[e.keyCode] === undefined) return;
                    if (e.keyCode === 32){
                        ctrl.player.spacePressed = false;
                    }
                    ctrl.keysPressed[e.keyCode] = false;
                    alterPlayer();
                };
                    //route based on keyup to detoggle key press map
                var keydownHandler = function(e){
                    if (ctrl.keysPressed[e.keyCode] === undefined) return;
                    if (e.keyCode === 32){
                        ctrl.player.spacePressed = true;
                    }
                    ctrl.keysPressed[e.keyCode] = true ;
                    alterPlayer();
                };
                    //add global event listeners that rout to the kepress routers
                angular.element(window).on('keydown', keydownHandler);
                angular.element(window).on('keyup', keyupHandler);
                    
                ctrl.socket.on('sync', (data) => {
                   
                    const { players, score } = data;
                    ctrl.score = score;
                    
                    for (let player of players) {
                        
                        const { rotation, id, x, y } = player;

                        ctrl.players[id].setPos(x, y, rotation);
                                
                            
                    }
                    
                });

          
                ctrl.socket.on('you', (msg) => {

                    const {playerId} = msg;
                    ctrl.playerId = playerId;
                    console.log(ctrl.playerId, 'you');

                });

                ctrl.socket.on('initGame', (data)=>{
                    const {players, score} = data;
                    ctrl.isLoading = false;
                    ctrl.score = score;
                    console.log('Game starting');
                    

                    shouldStart = true;
                    
                    for (let player of players){
                        const {rotation, team, id, x, y} = player;
                        ctrl.players[id] = new Player(team, id, true);
                        ctrl.players[id].setPos(x, y, rotation);

                        ctrl.players[id].img = team === 1 ? ctrl.img1 : ctrl.img2;

                        var playercanvas = document.createElement('CANVAS');
                        playercanvas.id=id;
                        playercanvas.height = 100;
                        playercanvas.width = 100;
                        // rotate 45 degrees clockwise
                        ctrl.players[id].canvas = playercanvas;
                      
                            
                    }
                    console.log(ctrl.players);
                
                });

                //call the main draw loop
                setInterval( gameLoop, TICK);
              
                
                   
                
            }
        };
         
            
        
    })


    // SPRITE ANIMATION AND ROTATION
    .directive('move', function() 
    {
        return{
            restrict : 'A',
            
            link : (scope, element) => 
            {
                var ctrl = scope.$ctrl;
          
                ctrl.canvas = element[0];
                var canvas = element[0];
                
                var ctx = canvas.getContext('2d');
   
                //refactor to not loop?                
                function gameLoop()
                {
                    if(ctrl.player){
                        window.requestAnimationFrame(gameLoop);
                        ctx.clearRect(0, 0, canvas.height, canvas.width);

                        var spin = ctrl.player.rotation;
 
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(spin * Math.PI / 180);
                        if (!(ctrl.player.team % 2)) {
                            ctx.drawImage(ctrl.teamoneimg, 0, 0, 25, 60, -14, -20, 25, 60);
                        } else {
                            ctx.drawImage(ctrl.teamtwoimg, 0, 0, 25, 60, -14, -20, 25, 60);
                        }
                        ctx.rotate((0 - spin) * Math.PI / 180);
                        ctx.translate(-canvas.width / 2, -canvas.height / 2);
                    }
                   
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