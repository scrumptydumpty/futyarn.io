var express = require('express');

var port = 1337

var gameInstance = express()

gameInstance.use(express.static(__dirname + '/../gameClient'))
gameInstance.use(express.static(__dirname + '/../node_modules'))


gameInstance.listen(port, () => 
    {
        console.log(`Game Instance Server running on port ${port}`)
    })