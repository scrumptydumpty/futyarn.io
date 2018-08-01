const express = require('express');
const gameInstance = express();
const http = require('http').createServer(gameInstance);
const io = require('socket.io')(http);
const { cache, TICK } = require('../shared/gamelogic');
const { Player } = require('../shared/Player');
const { Ball } = require('../shared/Ball');

var port = 1337;

// list of socket id's which are connected
const socketQueue = [];

let alreadyStarted = false;
let serverTick; // interval that clicks every TICK ms (200 default);

// swaps back and forth between 0 and 1, used to identify team 1 and 2
let teamToggle = 0; 

gameInstance.use(express.static(__dirname + '/../gameClient/dist'));
gameInstance.use(express.static(__dirname + '/../node_modules'));

const minify = (cache) => {
    const score = cache.score;
    // array list of players
    const playersArray = Object.keys(cache.players).map(key => cache.players[key]);
    const players = playersArray.map(
        ({ rotation, team, id, x, y }) => {
            return { rotation, team, id, x, y };
        }
    );
    return { score, players };
};

io.on('connection', function(socket)
{
    if (cache.totalPlayers>4){
        console.log('too many players');
        return;
    }

    const playerid = socket.id;
    const team = teamToggle;
    
    // toggle team for next person who joins
    teamToggle= (teamToggle++)%2;

    const newplayer = new Player(team, playerid);
    cache.players[playerid] = newplayer;

    socket.emit('you', { team, playerid } );
    console.log('connected a new player', playerid);
    
		
    if (alreadyStarted) {
        setTimeout(()=>{
            const data = minify(cache);
            io.to(playerid).emit('initGame', data);
            socketQueue.push(playerid);
        }, 1000);
    } else {
        socketQueue.push(playerid);
    }

    // console.log(cache)
    console.log('new client connected');
   
    

    cache.totalPlayers ++ ;
    cache.shouldStart = determineStart();

    var larry = setInterval(()=>{
        if(determineStart() && !(alreadyStarted)){
            cache.shouldStart = determineStart();
            startGame();

            clearInterval(larry);
        }
    }, 200);

    

    socket.on('uploadplayervector', function(msg)
    {
        //TODO: add a function to make sure ppl dont edit other folks locations
        let id = socket.id;

        console.log('got',id);
        if(cache.players[id] && !cache.players[id].updated){
            const {rotation} = msg;
            cache.players[id].rotation = rotation;
            cache.players[id].move();
            cache.players[id].updated = true;
        }
        
    });

    socket.on('disconnect', function()
    {
        console.log('disconnecting',socket.id);
        socketQueue.splice(socketQueue.indexOf(socket.id, 1));
        if (socketQueue.length < 1) {
            clearInterval(serverTick);
            alreadyStarted = false;
            cache.shouldStart = false;
        }

        delete cache.players[socket.id];
			
        console.log('current players', cache.players);
    });

});




http.listen(port, () => 
{
    console.log(`Game Instance Server running on port ${port}`);
});


const determineStart = function () 
{	console.log(socketQueue.length);
    return (socketQueue.length >= 1);
};


const startGame = function () 
{
    //on game should start, emit init game event, 
    //which should trigger DOM build for subcavnases on each of thye connected clients
    cache.ball = new Ball();
    const data = minify(cache);
    io.of('/').emit('initGame', data);
    var startWait = Date.now();
    console.log('Waiting to start game');
    while (Date.now() - startWait < 2000){
        continue;
    }

    alreadyStarted = true;
    console.log('Starting New Game');
    cache.gameStartTime = Date.now();

    const moveThings = ()=>{
  
        cache.ball.move();
        for (let key in cache.players) {
            cache.players[key].move();
        }
    };

    const handleCollisions = ()=>{
        // check for ball collisions

        const b = cache.ball;
        // check for head collisions
        // array of players
        const players = Object.keys(cache.players).map(key=>cache.players[key]);

        for(let player of players){
            b.catHeadCollides( player );
        }

        // check for body collisions
        for (let player of players) {
            b.catHeadCollides( player );
        }

        // check for wall bounce on ball last, to prevent boundry errors
        b.handleWallBounce();

        // check for goals
        const teamScored = b.isGoal(); // false, 1, 2
        if (teamScored) {
            cache.score[teamScored]++;
            b.reset();
        }

        // check for player out of bounds issues
        for (let player of players) {
            player.handleCollisions();
        }

    };

   

    const freePlayers = ()=>{
        if(cache.players) {
            Object.keys(cache.players).forEach(id => { cache.players[id].updated = false; });
        }
    };

    //establish server ticking
    serverTick = setInterval( () => {
        
        moveThings();
        handleCollisions();

        // get only the required data to send to sync
        const data = minify(cache);
        io.of('/').emit('sync', data);

        freePlayers(); // allow movement of players
    }, TICK);
};