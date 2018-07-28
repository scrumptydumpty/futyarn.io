const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config.js');
const db = require('../database/postgreSQL-index');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var bcryptjs = require('bcryptjs');



// // passport middleware to handle google authentication
// // sends user to google's login page
// // when autheticated by google, google sends back the user's profile info
//     // checks if user is in db
//         // if user found, done is called to proceed to the next step (redirect to the '/api/login/google/redirect' route)
//         // if user not found, add user to db and run done to proceed
// passport.use(
//     new GoogleStrategy({
//         // options for the google strategy
//         clientID: keys.google.clientID,
//         clientSecret: keys.google.clientSecret,
//         callbackURL: '/api/login/google/redirect'
//     }, (accessToken, refreshToken, profile, done) => {
//         console.log('GoogleStrategy callback function fired');
//         // console.log(profile);
//         const username = profile.displayName;
//         const password = '';
//         const google_id = profile.id;
//         db.authenticateUser(username, (err, foundUser) => {
//             if (foundUser) {
//                 console.log(`user ${username} already exists in database`);
//                 done(foundUser);
//             } else {
//                 console.log('user will be created with google oauth credentials');
//                 db.addNewUser(username, password, google_id, (err, newUser) => {
//                     if (err) {
//                         console.log('error with user signup via google oauth');
//                         console.log(err);
//                     } else {
//                         console.log('user signup via google oauth completed');
//                         // res.setStatus = 201;
//                         // res.send('user successfully signed up via google oauth');
//                         done(newUser);
//                     }
//                 });
//             }
//         });
//         // done();
//     })
// );


// passport middleware to handle local logins (via username and password)
// looks in database for user
    // if found, runs the done callback
passport.use(new LocalStrategy(
    (username, password, done) => {
        db.authenticateUser(username, (err, foundUser) => {
            if (err) {
                console.log('error during LocalStrategy auth: ', err);
                return done(err, null); 
            } else if (!foundUser) {
                console.log(`user ${username} not found during LocalStrategy auth`);
                return done(null, false); 
            } else {
                console.log('LocalStrategy found user: ', foundUser);
                const hash = foundUser.hash;
                bcryptjs.compare(password, hash, function(err, res) {
                    if (res) {
                        console.log(`user ${username} has been authenticated`);
                        return done(null, foundUser);
                    } else {
                        console.log('entered password is incorrect');
                        return done(null, false); 
                    }
                });
            }
        });
    }
));

// passport middleware to store user_id in session data
passport.serializeUser((user, done) => {
    console.log('serializeUser function fired');
    done(null, user.user_id);
});

// passport middleware to retreive user_id from session data and use to find the user in the db
passport.deserializeUser((id, done) => {
    console.log('deserilizeUser function fired');
    db.getUserInfo('id', id, (err, foundUser) => {
        done(null, foundUser);
    });
});


// create router instance and use middleware
const router = express.Router();
router.use(cookieParser());
router.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());



// // middleware for checking if user logged in
// // has not been implemented
// function isAuthenticated(req, res, next) {
//     const { sessionID } = req;
//     if ( sessionID ) {
//         return next();
//     } else {
//     // IF A USER ISN'T LOGGED IN
//         res.send(false);
//         // res.redirect('/');
//     }
// }
// // example
// router.get('/hello', isAuthenticated, function(req, res) {
//     res.send('look at me!');
// });





// route adds user to the db
// first checks if user is already in db
    // if yes, send back 409 status
    // if no, adds user to db
router.post('/api/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const google_id = '';

    db.authenticateUser(username, (err, foundUser) => {
        if (foundUser) {
            console.log(`user ${username} already exists in database`);
            res.setStatus = 409;
            res.send(`user ${username} already exists in database`);
        } else {
            bcryptjs.genSalt(10, function(err, salt) {
                bcryptjs.hash(password, salt, function(err, hash) {
                    db.addNewUser(username, hash, google_id, (err, data) => {
                        if (err) {
                            console.log('error with user signup');
                        } else {
                            console.log('user signup completed');
                            res.setStatus = 201;
                            res.send('user successfully signed up');
                        }
                    });
                });
            });
        }
    });
});


// authenticates user using passport
// if authentication succeeds, session is automatically created (via passport)
// and session is stored in session table in db via db.storeSession
router.post('/api/login',
    passport.authenticate('local', { 
        failureRedirect: '/api/login'
    }), (req, res) => {
        const { sessionID, user } = req;
        db.storeSession(sessionID, user.user_id, user.username, () => {});
        console.log('user sucessfully logged in via local auth');
        res.send('user sucessfully logged in via local auth');
    }
);


// // authenticates user using passport via google oauth
// // first route receives user google profile info back from google and redirects user to the second route
//     // (data returned is determined by items listed in scope)
// // second route creates a session for the authenticated user and stores the session in db
// // CURRENTLY HAS A CORS ISSUE ON REDIRECT
// router.get('/api/login/google', passport.authenticate('google', {
//     scope: ['profile']
// }));
// router.get('/api/login/google/redirect', passport.authenticate('google'/*, {
// failureRedirect: '/api/login/google/nope'
// }*/), (err, req, res) => {
//     console.log('==================================', err);
//     console.log('redirected to /api/login/google/redirect');
//     // console.log(req);
//     const { sessionID, user } = req;
//     db.storeSession(sessionID, user.user_id, user.username, () => {});
//     console.log('user sucessfully logged in via google auth');
//     // res.send('user sucessfully logged in via google auth');
//     res.redirect('/');
// });



// logs out user
// session is removed from db via db.removeSession
// session is removed from request header
// user is redirected back to main page
router.get('/api/logout', (req, res) => {
    const { sessionID } = req;
    db.removeSession(sessionID, () => {});
    req.session.destroy(() => { console.log(`session ${sessionID} destroyed`); });
    console.log('user sucessfully logged out');
    res.redirect('/');
});    



// get user leaderboard info (stats from top 10 users) from DB
router.get('/api/leaderboards', (req, res) => {
    db.getLeaderboards((err, topTenPlayers) => {
        if (err) {
            console.log('error getting leaderboards');
        } else {
            console.log('leaderboard data fetched');
            res.setStatus = 200;
            res.send(topTenPlayers);
        }
    });
});


// get info for a single user from DB
// currently not used in the client
router.get('/api/userinfo', (req, res) => {
    let username = req.body.username || 'good kitty';
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
    const { sessionID } = req;
    // verify if there is a session stored in sessions table
    db.verifySession(sessionID, (err, data) => {
        if (!data) {
            // if no session is found
            console.log('session does not exist');
            res.send(false);
        } else {
            // redirect?
            console.log('session is verified');
            res.send(true);
        }
    });
});

// receive game results from game server and post to db
// not yet implemented
router.post('/api/gameresults', (req, res, next) => {
});


// catch all route
// router.get('/*', (req, res, next) => {
//     //should serve static html
// });


module.exports.router = router;