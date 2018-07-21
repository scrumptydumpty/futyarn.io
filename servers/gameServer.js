var express = require('express');
var gameInstance = express()
var path = require('path')
var http = require('http').createServer(gameInstance)
var io = require('socket.io')(http)

var port = 1337


var cache = {
	ballLoc : {
		cx: 300,
		cy: 300,
		dx: 0,
		dy: 0
	}
}

var nextUserID = 0

gameInstance.use(express.static(__dirname + '/../gameClient'))
gameInstance.use(express.static(__dirname + '/../node_modules'))

gameInstance.get('/', function(req, res){

})

io.on('connection', function(socket){
	console.log('a user connected')
	io.emit('hi', nextUserID)
	nextUserID ++;

})


http.listen(port, () => 
    {
        console.log(`Game Instance Server running on port ${port}`)
    })
