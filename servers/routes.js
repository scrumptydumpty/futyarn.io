const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/config.js');

const db = require('../database/postgreSQL-index');
const passportSetup = require('./passport-setup.js');

// const cookieParser = require('cookie-parser')
// app.use(cookieParser());

// app.use(passport.initialize());

const router = express.Router();

router.get('/api/login', (req, res) => {
    res.send();
});


// auth with google
router.get('/api/login/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/api/login/google/redirect', passport.authenticate('google'/*, {
    failureRedirect: '/api/login/google/nope'
}*/), (req, res) => {
    res.redirect('/');
    // res.send('you are logged in via google');
});


router.get('/logout', (req, res) => {
    res.send('logging out');
});



router.post('/login',
    passport.authenticate('local', 
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        },
        function(req, res)
        {
            res.redirect('/');
        }
    )
);


router.post('/api/signup', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    db.getUserInfo(username, (err, data) => {
        if (data.rows[0]) {
            console.log(`user ${username} already exists in database`);
        } else {
            db.addNewUser(username, password, (err, data) => {
                if (err) {
                    console.log('error with user signup');
                } else {
                    console.log('user signup completed');
                    res.setStatus = 201;
                    res.send('user successfully signed up');
                }
            });
        }
    });
});

// add user to DB
router.post('/api/signup/google', (req, res, next) => {
  
});


// get user leaderboard info from DB
router.get('/api/leaderboards', (req, res, next) => {
    db.getLeaderboards((err, data) => {
        if (err) {
            console.log('error getting leaderboards');
        } else {
            console.log('leaderboard data received');
            // console.log(data.rows);
            res.setStatus = 200;
            res.send(data.rows);
        }
    });
});

// get user leaderboard info from DB
router.get('/api/userinfo', (req, res, next) => {
    let username = req.body.username || 'sucky kitty'; // CHANGE ME -----------------------------------------------------------------------------------------
    db.getUserInfo(username, (err, data) => {
        if (err) {
            console.log('error getting userinfo');
        } else {
            console.log('user info received');
            // console.log(data.rows[0]);
            res.setStatus = 200;
            res.send(data.rows[0]);
        }
    });
});


// contact game server to join a new game
router.get('/api/joingame', (req, res, next) => {
});

// receive game results from game server and post to db
router.post('/api/gameresults', (req, res, next) => {
});


// catch all route
// router.get('/*', (req, res, next) => {
//     //should serve static html
// });


module.exports.router = router;



// UNCOMMENT FOR SESSIONS
// const session = require('express-session');
// app.use(passport.session());
// app.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));

