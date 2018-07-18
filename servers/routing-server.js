var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database/postgreSQL-index');

var app = express();

var routes = require('./routes.js');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../node_modules'));

app.use('/', routes.router); // maybe '/*' insead of '/'


app.listen(port, () => {
    console.log(`routing server listening on ${port} 3k`);
});

module.exports.port = port;