var express = require('express');
var routes = require('./routes.js')


var app = express()


app.use(express.static(__dirname + '/../client'))
app.use(express.static(__dirname + '/../node_modules'))

app.use('/', routes.router) // maybe '/*' insead of '/'


app.listen(3000, () => {
  console.log('routing server listening on port 3k')
})