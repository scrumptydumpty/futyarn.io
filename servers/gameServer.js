const express = require('express');
const gameInstance = express();
const path = require('path');
const http = require('http').createServer(gameInstance);
const io = require('socket.io')(http);

var port = 1337;

const socketQueue = [];

const cache = {
    score : {
        teamOne : 0,
        teamTwo : 0
    },
    ballLoc : {
        cx: 300,
        cy: 300,
        dx: 0,
        dy: 0
    },
    players:[
        {
            currentX : -200,
	        currentY : -200,
	        rotation : 0,
	        right : 0,
	        down : 0,
	        id : 'disconnected',
	        index : 0
        },{
            currentX : -200,
	        currentY : -200,
	        rotation : 0,
	        right : 0,
	        down : 0,
	        id : 'disconnected',
	        index : 1
        },{
            currentX : -200,
		    currentY : -200,
		    rotation : 0,
		    right : 0,
		    down : 0,
		    id : 'disconnected',
		    index : 2
        },{
            currentX : -200,
	        currentY : -200,
	        rotation : 0,
	        right : 0,
	        down : 0,
	        id : 'disconnected',
	        index : 3
    	}
    ],
    totalPlayers : 0,
    shouldStart : false,
    gameRunning : true,
    officialServerTime : Date.now(),
    gameStartTime : 0
};

let alreadyStarted = false;
let LoadBeginning = 0;
let countdown = 5000;
let leniency = 500;
let tony;
let rate = 0;
let playerIndex = 0;
let lastTime = Date.now();
let thisTime = Date.now();

gameInstance.use(express.static(__dirname + '/../gameClient'));
gameInstance.use(express.static(__dirname + '/../node_modules'));

gameInstance.get('/', function(req, res){

});

io.on('connection', function(socket)
{
    playerIndex = findNextPlayerId();
    cache.players[playerIndex] = {
        currentX : 650,
	    currentY : 300,
	    rotation : 0,
	    right : 0,
	    down : 0,
	    id : socket.id,
	    index : playerIndex
    };
    console.log('connected a new player');
    if (alreadyStarted){
        var startWait = Date.now();
        setTimeout(()=>{
            io.to(socket.id).emit('initGame', cache);
            socketQueue.push(socket.id);
        }, 1000);
    } else {
        socketQueue.push(socket.id);

    }

    // console.log(cache)
    console.log('new client connected');
    //build room in a timely fashioon
    //keep track of when the first person joibned the room
    //attempt to cap wait time until a game starts
    //as time goes on, required game size to start should get smaller
    if (LoadBeginning === 0){
        LoadBeginning = Date.now();
    }

    cache.totalPlayers ++ ;
    cache.shouldStart = determineStart();

    var larry = setInterval(()=>{
        if(determineStart() && !(alreadyStarted)){
            cache.shouldStart = determineStart();
            startGame();

            clearInterval(larry);
        }
    }, 200);

    socket.emit('you', [socket.id, playerIndex]);
    playerIndex = findNextPlayerId(); 

    socket.on('uploadplayervector', function(msg)
    {
        //TODO: add a function to make sure ppl dont edit other folks locations
        cache.players[msg.index] = msg;
        // console.log(cache)

    });

    socket.on('disconnect', function()
    {
        console.log(socket.id);
        socketQueue.splice(socketQueue.indexOf(socket.id, 1));
        if (socketQueue.length < 1) {
            clearInterval(tony);
            alreadyStarted = false;
            cache.shouldStart = false;
        }
        for (var i = 0; i < cache.players.length; i++){
            if (cache.players[i].id === socket.id){
                var index = i;
                cache.players[i] = Object.assign({}, {
       				currentX : -200,
			        currentY : -200,
			        rotation : 0,
			        right : 0,
			        down : 0,
			        id : 'disconnected',
			        index : index
    			});

    			console.log(cache.players[i]);
            }
        }
        console.log(cache.players);
    });

});




http.listen(port, () => 
{
    console.log(`Game Instance Server running on port ${port}`);
});

const ballGoalCollisionDetect = function ()
{
    var ball = cache.ballLoc;
    if (ball.cy > 250 && ball.cy < 400){
        if (ball.cx <= 55){
            cache.score.teamOne ++;
            ball.cx = 600;
            ball.cy = 325;
            ball.dx = 0;
            ball.dy = 0; 
            //add invulnerability until ppl on the right sides
            return true;
        } else if (ball.cx >= 1145){
            cache.score.teamTwo ++;
            ball.cx = 600;
            ball.cy = 325;
            ball.dx = 0;
            ball.dy = 0; 
            //add invulnerability until ppl on the right sides
            return true;
        }
    }
    return false;
};

const ballWallCollisionDetect = function () 
{
    var ball = cache.ballLoc;
    if (ball.cy < 0 ){
        ball.dy = 0 - ball.dy;
        ball.cy = 0;
    }
    if (ball.cy > 640){
        ball.dy = 0 - ball.dy;
        ball.cy = 640;
    }
    if (ball.cx < 55){
        ball.dx = 0 - ball.dx;
        ball.cx = 55;
    }
    if (ball.cx > 1145){
        ball.dx = 0 - ball.dx;
        ball.cx = 1145;
    }
};

const catHeadBallCollisionDetect = function (playerVector, hitRadius)
{
    const ball = cache.ballLoc;
    const hitBoxMap = {
        0   : [50,45],
        45  : [56,48],
        90  : [60,55],
        135 : [56,58],
        180 : [50,62],
        225 : [44,58],
        270 : [40,55],
        315 : [44,48],
    };
    const centerX = playerVector.currentX + hitBoxMap[playerVector.rotation][0];
    const centerY = playerVector.currentY + hitBoxMap[playerVector.rotation][1];
    const ballCenterX = ball.cx + 5;
    const ballCenterY = ball.cy + 5;

    const ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - centerX), 2) + Math.pow((ballCenterY - centerY),2));
	
    if (ballCenterDelta < hitRadius) {
        ball.dx += (1.05 * (playerVector.right) - ball.dx);
        ball.dy += (1.05 * (playerVector.down)  - ball.dy);

        if(playerVector.spacePressed){
            generateKick(playerVector);
        }
    }
};

const catBodyCollisionDetect = function (playerVector, hitRadius)
{
    const catCenterX = 50 + playerVector.currentX;
    const catCenterY = 50 + playerVector.currentY;
    const ball = cache.ballLoc;
    const ballCenterX = ball.cx + 5;
    const ballCenterY = ball.cy + 5;

    const ballCenterDelta = Math.sqrt(Math.pow((ballCenterX - catCenterX), 2) + Math.pow((ballCenterY - catCenterY),2));

    if (ballCenterDelta < hitRadius) {
        ball.dx += (1.1 * (playerVector.right) - ball.dx);
        ball.dy += (1.1 * (playerVector.down)  - ball.dy);
    }
};

const generateKick = function (playerVector)
{
    const ball = cache.ballLoc;
    const map = {
	   0   : [0,-.502],
        45  : [.502,-.502],
        90  : [.502,0],
        135 : [.502,.502],
        180 : [0,.502],
        225 : [-.502,.502],
        270 : [-.502,0],
        315 : [-.502,-.502]
    };
    const xdiff = (Math.floor(Math.random() * 300) - 150) / 1000;
    const ydiff = (Math.floor(Math.random() * 300) - 150) / 1000;
    const array = map[playerVector.rotation];

    array[0] += xdiff;
    array[1] += ydiff;
    ball.cx += (5 * array[0]);
    ball.cy += (5 * array[1]);
    ball.dx = array[0];
    ball.dy = array[1];
};

const moveTheBall = function () 
{
    const ball = cache.ballLoc;
    const timeDelta = (thisTime - lastTime);
    ball.cx += ball.dx * timeDelta;
    ball.cy += ball.dy * timeDelta;
    console.log(cache.ballLoc);
    //friction on y axis
    if (Math.abs(ball.dy) > 0.02){
        if (ball.dy > 0){
            ball.dy -= .0021;
        } else {
            ball.dy += .0021;
        }
    } else {
        ball.dy = 0;
    }

    //friction on y axis
    if (Math.abs(ball.dx) > 0.02){
        if (ball.dx > 0){
            ball.dx -= .0021;
        } else {
            ball.dx += .0021;
        }
    } else {
        ball.dx = 0;
    }	

    ballGoalCollisionDetect();
    ballWallCollisionDetect();
    //gotta 'strapolate because we only ticking at like 30hz
    //and there's a decent chance the ball will pass through people who respond slowly
    cache.players.forEach((vector) => 
    {
        // catHeadBallCollisionDetect(vector, 11);
        // catBodyCollisionDetect(vector, 13);
        const predictionVector = extrapolatePlayerVector(vector);
        catHeadBallCollisionDetect(predictionVector, 13);
        catBodyCollisionDetect(predictionVector, 11);
    });
};

const determineStart = function () 
{	console.log(socketQueue.length);
    return (socketQueue.length >= 1);
};

const extrapolatePlayerVector = function (playerVector)
{
    const timeSinceLastUpdate = (Date.now() - playerVector.updateTime);
    const newVector = Object.assign({}, playerVector);
    newVector.currentX += (newVector.right * timeSinceLastUpdate);
    newVector.currenyY += (newVector.down  * timeSinceLastUpdate);
    return newVector;
};

const findNextPlayerId = function (){
    for (let i = 0; i < cache.players.length; i ++){
        if (cache.players[i].id === 'disconnected'){
            return i;
        }
    }
    return cache.players.length;
};

const startGame = function () 
{
    //on game should start, emit init game event, 
    //which should trigger DOM build for subcavnases on each of thye connected clients
    io.of('/').emit('initGame', cache);
    var startWait = Date.now();
    while (Date.now() - startWait < 2000){
        var wait = true;
        console.log('waiting');
    }

    alreadyStarted = true;
    console.log('starting New Game');
    cache.gameStartTime = Date.now();
    countdown = 10000;
    leniency = 5000;

    //establish server ticking
    tony = setInterval(()=>
    {
        lastTime = thisTime;
        thisTime = Date.now();
        moveTheBall();
        console.log(cache.players.length);
        cache.officialServerTime = Date.now();
        let next = socketQueue.shift();
        io.to(next).emit('cache', cache);
        socketQueue.push(next);
    }, 30);	
};