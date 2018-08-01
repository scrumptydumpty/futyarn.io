angular.module('gameinstance')
    .controller('gameCtrl', function (/*required services go in here*/)
    {
        // this.localCache = {
        //     score : {
        //         teamOne : 0,
        // 		teamTwo : 0
        //     },
        //     ballLoc: {
        //         cx: 600,
        //         cy: 0,
        //         dx: 0,
        //         dy: 4.76
        //     },
        //     players:{}
        // };

        // this.checkElements = false;

        // this.initcache =[];

 	this.socket = io.connect('localhost:1337');

 	this.socket.on('initGame', (msg)=>{
 		// alert('gameBeginning')
            var data = msg;
            console.log(data);
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

        this.catImageOne = new Image();
        this.catImageOne.src = '/images/BlackCatUp.gif';

        this.catImageTwo = new Image();
        this.catImageTwo.src = '/images/orangeCatSpriteUp.gif';

    
    })
    .component('game', {
        bindings : {},
        controller : 'gameCtrl',
        templateUrl : './templates/game.html'
    });