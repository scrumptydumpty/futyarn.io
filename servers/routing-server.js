const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes.js');
// const cookieSession = require('cookie-session');
// const keys = require('../config.js');
// const passport = require('passport');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config.js');
const db = require('../database/postgreSQL-index');
const cookieParser = require('cookie-parser');
const session = require('express-session');


passport.use(new LocalStrategy(
    // {
    //     // usernameField: 'email',
    //     // passwordField: 'passwd',
    //     passReqToCallback: true
    // },
    (username, password, done) => {
        db.getUserInfo('username', username, (err, foundUser) => {
            console.log('localstrategy error: ', err);
            console.log('localstrategy foundUser: ', foundUser);
            if (err) { return done(err); }
            if (!foundUser) { return done(null, false); }
            if (foundUser.password != password) { return done(null, false); }
            return done(null, foundUser);
        });
    }
));
  

passport.serializeUser((user, done) => {
    console.log('serilizeUser function fired');
    done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
    console.log('deserilizeUser function fired');
    console.log('id: what is going on ?????????????????????????????????????????????????????????????');
    console.log(id);
    db.getUserInfo('id', id, (err, foundUser) => {
        done(null, foundUser);
    });
});



const app = express();
app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../node_modules'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/login',
    passport.authenticate('local', { 
        failureRedirect: '/api/login'
    }), (req, res) => {
        const { sessionID, user } = req;
        db.storeSession(sessionID, user.user_id, user.username, () => {});
        console.log('user sucessfully logged in via local auth');
        res.send('user sucessfully logged in via local auth');
    }
);

app.get('/api/logout', (req, res) => {
    // req.logout();
    const { sessionID } = req;
    db.removeSession(sessionID, () => {});
    req.session.destroy(() => { console.log(`session ${sessionID} destroyed`); });
    console.log('user sucessfully logged out');
    res.redirect('/');
});    

// app.use('/auth', someFile); // for auth routes

app.use('/', routes.router); // maybe '/*' insead of '/'

let port = process.env.PORT || 3000;
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