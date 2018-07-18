var express = require('express');
var router = express.Router();



// /api/login
router.get('/login', (req, res, next) => {
    //hit up that DB
    
    res.setStatus = 200;
    res.end('<div><div> hello!!!  </div> </div>');
});

router.get('/leaderboards', (req, res, next) => {
    //hit up that DB
    
});

router.post('/signup', (req, res, next) => {
    //hit up that DB
    
});

router.get('/joingame', (req, res, next) => {
    //hit up russell's server
    
});

// router.get('/*', (req, res, next) => {
//     //should serve static html
  
// });

module.exports.router = router;