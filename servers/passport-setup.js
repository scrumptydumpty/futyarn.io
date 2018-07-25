const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/config.js');

const db = require('../database/postgreSQL-index');

// const cookieParser = require('cookie-parser')
// app.use(cookieParser());

// app.use(passport.initialize());

// passport.serializeUser((user, done) => {
//     console.log('serilizeUser function fired');
//     done(null, user.user_id)
// });

// passport.deserializeUser((id, done) => {
//     console.log('deserilizeUser function fired');
//     console.log('id: what is going on ?????????????????????????????????????????????????????????????');
//     console.log(id);
//     db.getUserInfo('id', id, (user) => {
//         done(null, user);
//     });
// });

passport.use(
    new GoogleStrategy({
    // options for the google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/api/login/google/redirect' // ------------------------------------update
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('passport callback function fired');
        console.log(profile);
        // const googleId = profile.id; // add later
        const username = profile.displayName;
        const password = 'password';
        db.getUserInfo('username', username, (err, data) => {
            const foundUser = data.rows[0];
            if (foundUser) {
                console.log(`user ${username} already exists in database`);
                done(null, foundUser);
            } else {
                console.log('user will be created with google oauth credentials')
                db.addNewUser(username, password, (err, newUser) => {
                    if (err) {
                        console.log('error with user signup via google oauth');
                        console.log(err);
                    } else {
                        console.log('user signup via google oauth completed');
                        // res.setStatus = 201;
                        // res.send('user successfully signed up via google oauth');
                        done(null, newUser);
                    }
                });
            }
        });
        done();
    }
));






// passport.use(new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'passwd'
//         // passReqToCallback: true,
//         // session: false
//     },
//     function(username, password, done)
//     {
//         User.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));

