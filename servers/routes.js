var express = require('express');
var router = express.Router();
var db = require('../database/postgreSQL-index');



// hit up DB to find user info and login
// establish a session
router.post('/api/login', (req, res, next) => {
    res.setStatus = 200;
    res.end('<div><div> hello!!!  </div> </div>');
});

// get user leaderboard info from DB
router.get('/api/leaderboards', (req, res, next) => {
    db.getLeaderboard((err, data) => {
        if (err) {
            console.log('error getting leaderboards');
        } else {
            console.log(data.rows);
            res.send(data.rows);
        }
    });
});

// add user to DB
router.post('/api/signup', (req, res, next) => {
    
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