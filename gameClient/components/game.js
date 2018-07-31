angular.module('gameinstance')
    .controller('gameCtrl', function (/*required services go in here*/)
    {
        this.localCache = {
            score : {
                teamOne : 0,
        	teamTwo : 0
            },
            ballLoc: {
                cx: 600,
                cy: 0,
                dx: 0,
                dy: 4.76
            },
            players:[{
       				currentX : -200,
			        currentY : -200,
			        right : 0,
			        down : 0,
			        id : 'disconnected',
			        index : 0
                //left : 0 - this.right
                //up : 0 - this.down
    			},{
       				currentX : -200,
			        currentY : -200,
			        right : 0,
			        down : 0,
			        id : 'disconnected',
			        index : 1
                //left : 0 - this.right
                //up : 0 - this.down
    			},{
       				currentX : -200,
			        currentY : -200,
			        right : 0,
			        down : 0,
			        id : 'disconnected',
			        index : 2
                //left : 0 - this.right
                //up : 0 - this.down
    			},{
       				currentX : -200,
			        currentY : -200,
			        right : 0,
			        down : 0,
			        id : 'disconnected',
			        index : 3
                //left : 0 - this.right
                //up : 0 - this.down
    			}]
        };

        this.checkElements = false;

        this.initcache =[];

 	this.socket = io.connect('https://futyarn-game.herokuapp.com:1337');

 	this.socket.on('initGame', (msg)=>{
 		// alert('gameBeginning')
 		var data = msg;
 		// for (var player in data.players){
 		// 	this.initcache.push(data.players[player])
 		// }
 		// for (var i = 0; i < 4 ; i ++){
 			
 		// 	console.log(this)
 		// }
 		this.checkElements = true;
 		// this["player0"] = angular.element(document.querySelector(`#oppCat0`))
 		// this["player1"] = angular.element(document.querySelector(`#oppCat1`))
 		// this["player2"] = angular.element(document.querySelector(`#oppCat2`))
 		// this["player3"] = angular.element(document.querySelector(`#oppCat3`))
 		// var tony = () => {console.log(this)}
 		// george=tony.bind(this)
 		// setTimeout(george, 3000)
 		// console.log(data)
 		// console.log(this.initcache)
 		console.log('Game Beginning');
 	});

 	this.socket.on('hi', (msg) =>  
 	{
 		//console.log(this)
 		this.userId = msg; 

 	});

 	

 	// this.counter = 0
        // this.socket.on('ping', (msg) => 
        // {
        //     this.localCache = msg
        //     this.localCache.playerVector = this.localCache.players[this.socketID]
        //     delete this.localCache.players[this.socketID]
        //     // console.log(this.localCache.playerVector)
        //     console.log(this.localCache)
        //     // console.log(this.socketID)
        //     // this.counter ++;
        //     // this.socket.emit('howdy', this.counter)
        // })


        // this.socket.emit('howdy', this.counter)
 
        // this.socket = io('http://localhost:1337/');
        this.catImageOne = new Image();
        this.catImageOne.src = 'assets/images/BlackCatUp.gif';

        this.catImageTwo = new Image();
        this.catImageTwo.src = 'assets/images/orangeCatSpriteUp.gif';

    
    })
    .component('game', {
        bindings : {},
        controller : 'gameCtrl',
        templateUrl : './templates/game.html'
    });