var express = require('express');
var router = express.Router();
var db = require('../database/postgreSQL-index');



// add user to DB
router.post('/api/signup', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    db.addNewUser(username, password, (err, data) => {
        if (err) {
            console.log('error with user signup');
        } else {
            console.log('user signup completed');
            res.setStatus = 201;
            res.send('user successfully signed up');
        }
    });
});


// hit up DB to find user info and login
// establish a session
router.post('/api/login', (req, res, next) => {
    res.end();
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
    let username = 'sucky kitty'; // CHANGE ME -----------------------------------------------------------------------------------------
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


// hit up russell's server
router.get('/api/joingame', (req, res, next) => {
    
    
});

// post game resultes to DB
router.post('/api/gameresults', (req, res, next) => {
    
    
});


// catch all route
// router.get('/*', (req, res, next) => {
//     //should serve static html
  
// });

module.exports.router = router;