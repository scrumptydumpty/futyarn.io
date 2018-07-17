var express = require('express');


var gameInstance = express()

app.use(express.static(__dirname + '/../node_modules'))
app.use(express.static(__dirname + '/../client'))


gameInstance.listen(1337, () => {

})