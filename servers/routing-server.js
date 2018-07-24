var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes.js');
const passportSetup = require('./passport-setup.js');

// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var passport = require('passport');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../node_modules'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/auth', someFile); // for auth routes

// app.use('/auth', authRoutes.authRouter);

app.use('/', routes.router); // maybe '/*' insead of '/'

app.listen(port, () => {
    console.log(`routing server listening on ${port}`);
});

module.exports.app = app;


// app.configure(function() {
//     app.use(express.static('public'));
//     app.use(express.cookieParser());
//     app.use(express.bodyParser());
//     app.use(express.session({ secret: 'keyboard cat' }));
//     app.use(passport.initialize());
//     app.use(passport.session());
//     app.use(app.router);
//   });