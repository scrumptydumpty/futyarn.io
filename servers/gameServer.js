const express = require('express');
const gameInstance = express();
const http = require('http').createServer(gameInstance);
const io = require('socket.io')(http);
const { TICK, status } = require('../shared/gamelogic');
const { Player } = require('../shared/Player');
const { Ball } = require('../shared/Ball');
const { hashUserConnectionDict } = require('./routes.js');

var port = 1337;

// GAME STATE LIVES HERE
let socketIdToUserObject = {};
let score = {0:0, 1:0};
let maxnumplayers = 4;
let minnumplayers = 1;
let winningGoalCount = 3;
let ball = null;
let computingGameLoop = false; //prevent one loop from running over another 
let players = {}; // player objects
let gameStatus = status.waitingForPlayers;
let activePlayers = [];
let audienceQueue = [];
let disconnectedPlayers = [];
let playersWhoNeedInitialData = [];
let playerMovementQueue = [];


// server vars
let serverTick; // interval that clicks every TICK ms (200 default);
let logTick;// interval for console logs
let teamToggle = 0; // swaps back and forth between 0 and 1, used to identify team 1 and 2

const minify = () => {
    // array list of players
    //console.log(activePlayers,'activeplayers');
    const miniPlayers = activePlayers.map(id=> players[id]).map(
        ({ rotation, team, id, x, y, kicking, username, user_id }) => {
            return { rotation, team, id, x, y, kicking, username, user_id };
        }
    );

    const {x,y,dx,dy} = ball;

    return { score, players:miniPlayers, ball:{x,y,dx,dy} };
};



io.on('connection', function(socket)
{

    socket.on('credentials',(msg)=>{
        
        const {randomHash} = msg;
        if (hashUserConnectionDict[randomHash]) {
            const { username, user_id } = hashUserConnectionDict[randomHash];
            socket.user_id = user_id;
            socketIdToUserObject[socket.id] = {username, user_id};
            console.log('user',username,'connected to game server');
            socket.emit('credentialsVerified');
        }
    }); 

    socket.on('joingame', function () {

        if (!socket.user_id) {
            return;
        }
        const playerId = socket.id;
        audienceQueue.push(playerId);
        console.log('user ', socket.user_id, 'joined the game');


    });


    

    socket.on('playermove', function(msg) {
        //TODO: add a function to make sure ppl dont edit other folks locations
        let id = socket.id;
        try{
            if (players[id].canmove) {

                players[id].canmove = false;

                const { rotation, kicking } = msg;
                players[id].rotation = rotation;
                players[id].kicking = kicking;
                playerMovementQueue.push(id);
            }
        }catch(err){
            console.log(err);
        }
        
    });

    socket.on('disconnect', function()
    {   
        disconnectedPlayers.push(socket.id);

    });

});

const addPlayerFromQueue = (socketId)=>{
    const playerTeam = teamToggle;

    // toggle team for next person who joins
    teamToggle = (teamToggle+1) % 2;
    const {username, user_id} = socketIdToUserObject[socketId];
    const newplayer = new Player(playerTeam, socketId, user_id, username);
    players[socketId] = newplayer;
    activePlayers.push(socketId);
    io.to(socketId).emit('you', { socketId });
    console.log('added new player to game');

    if (gameStatus === status.active) {
        console.log('sending active game data to user');
        playersWhoNeedInitialData.push(socketId);
    }
};


const moveThings = () => {

    ball.move();
    for (let id of playerMovementQueue) {
        if (players[id]) {
            players[id].move();
        }
        playerMovementQueue = [];
    }
};

const handleCollisions = () => {
    // check for ball collisions

    
    // check for head collisions
    // array of players
    const currentPlayers = activePlayers.map(id=>players[id]);
    for (let player of currentPlayers) {
        ball.catHeadCollides(player);
    }

    // check for body collisions
    for (let player of currentPlayers) {
        ball.catHeadCollides(player);
    }

    // check for goals
    const teamScored = ball.isGoal(); // false, 0 , 1
    if (teamScored) {
        const playerWhoScoredId = ball.playerLastTouched;
        const playerWhoScored = players[playerWhoScoredId];
        console.log('player', playerWhoScored.username,'scored!');
        console.log(players);
        console.log(+teamScored, 'teamScored', playerWhoScored.team, 'players team');
        if (playerWhoScored && +teamScored !== playerWhoScored.team) { // teams are backwards! hacky fix
            playerWhoScored.goals++;
        }
        score[teamScored]++;
        ball.reset();
    }
    // check for wall bounce on ball last, to prevent boundry errors
    ball.handleWallBounce();


    // check for player out of bounds issues
    for (let player of currentPlayers){
        player && player.handleCollisions();
    }

};

const lockPlayers = () => {
    try{
        activePlayers.forEach(id => {
            players[id].canmove = false;
        });
    }catch(err){console.log(err);}
    
};

const freePlayers = () => {
   
    try {
        activePlayers.forEach(id => {
            players[id].canmove = true;
        });
    } catch (err) { console.log(err); }
    
};


const startGame = function () 
{   
    console.log('Waiting to start game');
    gameStatus = status.active;
    ball = new Ball();
    const data = minify();
   
    

    var startWait = Date.now();
    
    while (Date.now() - startWait < 2000){
        continue;
    }
    console.log('Started New Game');
    io.of('/').emit('initGame', data);
    
   
};

const handleWin = ()=> {
    

    winningTeam = score[0]>score[1]? 1 : 2;


    // reset score
    
    
    //clear queues and game settings
    activePlayers = [];
    audienceQueue = [];
    disconnectedPlayers = [];
    playersWhoNeedInitialData = [];
    playerMovementQueue = [];
    players = {};
    score = { 0: 0, 1: 0 };
    teamToggle = 0;
    console.log('restarting game server');
    gameStatus = status.waitingForPlayers;
    computingGameLoop = false;
    
};

const checkForEnd = ()=>{

    if (score[0] === winningGoalCount)
    {   console.log('team 1 won!');
        io.emit('won', 0);
        gameStatus = status.gameWon;
       
    }
    
    else if (score[1] === winningGoalCount){
        console.log('team 2 won!');
        io.emit('won',1);
        gameStatus = status.gameWon;
    }

};

const checkForDisconnects = () => {
    while(disconnectedPlayers.length>0){
        const id = disconnectedPlayers.pop();
        console.log('disconnecting', id);
        activePlayers.splice(activePlayers.indexOf(id), 1 );
        delete playerMovementQueue[id];
        delete players[id];
    }
};

const addWaitingPlayers = ()=>{
    // just adds one for now if there's room
    if (audienceQueue.length>0 && activePlayers.length<maxnumplayers){
        const id = audienceQueue.pop();
        addPlayerFromQueue(id);
    }
};
 
const gameLoop = () => setInterval(() => {
    if(computingGameLoop){
        return;
    }
    computingGameLoop = true;

    checkForDisconnects();
    if(!activePlayers.length){
        gameStatus = status.waitingForPlayers;
    }
    if(gameStatus === status.active){
        lockPlayers();
        moveThings();
        handleCollisions();
        checkForEnd();

        if(gameStatus === status.gameWon){
            handleWin();
            return;
        }

        const data = minify();
        io.of('/').emit('sync', data);

        while (playersWhoNeedInitialData.length > 0) {
            const id = playersWhoNeedInitialData.pop();
            io.to(id).emit('initGame', data);
        }
        freePlayers();

    } else if (gameStatus === status.waitingForPlayers){
        if(activePlayers.length>=minnumplayers){
            startGame();
        }else{
            io.emit('connectedcount',activePlayers.length);
        }
    }
    
    
    addWaitingPlayers();
    computingGameLoop = false;
}, TICK);


const serverLog = ()=>setInterval(()=>{
    const now = Date.now();
    console.log(now, 'Server Status', gameStatus, 'Players', activePlayers.length, 'Audience', audienceQueue.length);
}, 5000);


serverTick = gameLoop();
//logTick = serverLog();


http.listen(port, () => {
    console.log(`Game Instance Server running on port ${port}`);
});