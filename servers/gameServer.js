const express = require('express');
const gameInstance = express();
const http = require('http').createServer(gameInstance);
const io = require('socket.io')(http);
const { TICK, status } = require('../shared/gamelogic');
const { Player } = require('../shared/Player');
const { Ball } = require('../shared/Ball');
const { hashUserConnectionDict } = require('./routes.js');
hashUserConnectionDict['a'] = 'a';
var port = 1337;

// GAME STATE LIVES HERE
const score = {1:0, 2:0};
let maxnumplayers = 4;
let minnumplayers = 1;
let winningGoalCount = 1;
let ball = null;
let players = {}; // player objects
let gameStatus = status.waitingForPlayers;
const activePlayers = [];
const audienceQueue = [];
const disconnectedPlayers = [];
const playersWhoNeedInitialData = [];
let playerMovementQueue = [];

// server vars
let serverTick; // interval that clicks every TICK ms (200 default);
let logTick;// interval for console logs
let teamToggle = 0; // swaps back and forth between 0 and 1, used to identify team 1 and 2

const minify = () => {
    // array list of players
    //console.log(activePlayers,'activeplayers');
    const miniPlayers = activePlayers.map(id=> players[id]).map(
        ({ rotation, team, id, x, y, kicking }) => {
            return { rotation, team, id, x, y, kicking };
        }
    );

    const {x,y,dx,dy} = ball;

    return { score, players:miniPlayers, ball:{x,y,dx,dy} };
};

io.on('connection', function(socket)
{

    socket.on("credentials",(msg)=>{

        const {randomHash} = msg;
        if(hashUserConnectionDict[randomHash]){
            socket.emit("credentialsVerified");
            socket.username = hashUserConnectionDict[randomHash];
            // delete hashUserConnectionDict[randomHash];

            const playerId = socket.id;
            audienceQueue.push(playerId);

            console.log('user ',socket.username,'connected')
        }


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

const addPlayerFromQueue = (playerId)=>{
    const playerTeam = teamToggle;

    // toggle team for next person who joins
    teamToggle = (teamToggle++) % 2;

    const newplayer = new Player(playerTeam, playerId);
    players[playerId] = newplayer;
    activePlayers.push(playerId);
    io.to(playerId).emit('you', { playerId });
    console.log('added new player to game', playerId);

    if (gameStatus === status.active) {
        console.log('sending active game data to user');
        playersWhoNeedInitialData.push(playerId);
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
    const teamScored = ball.isGoal(); // false, 1, 2
    if (teamScored) {
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
    console.log('sending init data');
    io.of('/').emit('initGame', data);

    var startWait = Date.now();
    
    while (Date.now() - startWait < 2000){
        continue;
    }
    console.log('Started New Game');
    
   
};

const checkForEnd = ()=>{

    if (score[1] === winningGoalCount)
    {
        clearInterval(serverTick);
        io.emit('won', 1);
    }
    
    else if (score[2] === winningGoalCount){
        clearInterval(serverTick);
        io.emit('won',2);
    }

};

const checkForDisconnects = () => {
    while(disconnectedPlayers.length>0){
        const id = disconnectedPlayers.pop();
        
        console.log('disconnecting', id);
        activePlayers.splice(activePlayers.indexOf(id), 1 );
        delete playerMovementQueue[id];
        delete players[id];
        
        io.to('/').emit('removePlayer', id);
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
    checkForDisconnects();
    if(gameStatus === status.active){
        lockPlayers();
        moveThings();
        handleCollisions();
        checkForEnd();

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
        }
    }
    
    
    addWaitingPlayers();

}, TICK);


const serverLog = ()=>setInterval(()=>{
    const now = Date.now();
    console.log(now, 'Server Status', gameStatus, 'Players', activePlayers.length, 'Audience', audienceQueue.length);
}, 5000);


serverTick = gameLoop();
logTick = serverLog();


http.listen(port, () => {
    console.log(`Game Instance Server running on port ${port}`);
});