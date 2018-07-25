const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config.js');
const db = require('../database/postgreSQL-index');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const router = express.Router();
// router.use(cookieParser());
// router.use(session({
//     secret: keys.session.secret,
//     resave: false,
//     saveUninitialized: false
// }));
// router.use(passport.initialize());
// router.use(passport.session());
// const cookieSession = require('cookie-session');
// const passportSetup = require('./passport-setup.js');

// passport.use(new LocalStrategy(
//     {
//         // usernameField: 'email',
//         // passwordField: 'passwd',
//         passReqToCallback: true
//     },
//     (req, username, password, done) => {
//         db.getUserInfo('username', username, (err, foundUser) => {
//             console.log('localstrategy error: ', err);
//             console.log('localstrategy foundUser: ', foundUser);
//             if (err) { return done(err); }
//             if (!foundUser) { return done(null, false); }
//             if (foundUser.password != password) { return done(null, false); }
//             return done(null, foundUser);
//         });
//     }
// ));
  

// passport.serializeUser((user, done) => {
//     console.log('serilizeUser function fired');
//     done(null, user.user_id);
// });

// passport.deserializeUser((id, done) => {
//     console.log('deserilizeUser function fired');
//     console.log('id: what is going on ?????????????????????????????????????????????????????????????');
//     console.log(id);
//     db.getUserInfo('id', id, (err, foundUser) => {
//         done(null, foundUser);
//     });
// });




router.post('/api/signup', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    db.getUserInfo('username', username, (err, foundUser) => {
        if (foundUser) {
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



// router.post('/api/login',
//     passport.authenticate('local', { 
//         failureRedirect: '/api/login'
//     }, (req, res) => {
//         console.log('user sucessfully logged in via local auth');
//         console.log('req', req);
//         console.log('res', res);
//         // res.redirect('/');
//     })
// );

// router.get('/api/logout', (req, res) => {
//     // req.logout();
//     req.session.destroy(() => { console.log('session destroyed'); });
//     console.log('user sucessfully logged out');
//     res.redirect('/');
// });    





// GOOGLE AUTH
// passport.use(
//     new GoogleStrategy({
//         // options for the google strategy
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret,
//         callbackURL: '/api/login/google/redirect' // ------------------------------------update
//     }, (accessToken, refreshToken, profile, done) => {
//         // passport callback function
//         console.log('passport callback function fired');
//         console.log(profile);
//         // const googleId = profile.id; // add later
//         const username = profile.displayName;
//         const password = 'password';
//         db.getUserInfo('username', username, (err, foundUser) => {
//             if (foundUser) {
//                 console.log(`user ${username} already exists in database`);
//                 done(null, foundUser);
//             } else {
//                 console.log('user will be created with google oauth credentials')
//                 db.addNewUser(username, password, (err, newUser) => {
//                     if (err) {
//                         console.log('error with user signup via google oauth');
//                         console.log(err);
//                     } else {
//                         console.log('user signup via google oauth completed');
//                         // res.setStatus = 201;
//                         // res.send('user successfully signed up via google oauth');
//                         done(null, newUser);
//                     }
//                 });
//             }
//         });
//         done();
//     }
// ));

// router.get('/api/login/google', passport.authenticate('google', {
//     scope: ['profile']
// }));        

// router.get('/api/login/google/redirect', passport.authenticate('google'/*, {
//     failureRedirect: '/api/login/google/nope'
// }*/), (req, res) => {
//     // res.send(req.user);
//     res.redirect('/');
//     // res.send('you are logged in via google');
// });    








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
    db.getUserInfo('username', username, (err, foundUser) => {
        if (err) {
            console.log('error getting userinfo');
        } else {
            console.log('user info received');
            // console.log(foundUser);
            res.setStatus = 200;
            res.send(foundUser);
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

