const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');

const app = express();
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../node_modules'));

// not sure if cookie parser needed in this file
// it is already used and required in routes.js
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes.router); // maybe '/*' insead of '/'

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`routing server listening on ${port}`);
});

module.exports.app = app;
