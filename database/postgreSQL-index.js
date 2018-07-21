var pg = require('pg');
var config = require('../config.js');
var connection = config.connection;
var pgClient = new pg.Client(connection);

pgClient.connect();

pgClient.on('error', () => 
{
    console.log('postgres connection error');
});

pgClient.once('open', () => 
{
    console.log('postgres connected successfully');
});


// FUNCTION NEEDED
// addNewUser

const addNewUser = (username, password, callback) =>
{
    console.log('addNewUser function fired, username: ', username);
    let addNewUserQuery = `INSERT INTO players (username, password, wins, losses, games_played, goals_made) VALUES ('${username}', '${password}', 0, 0, 0, 0)`;
    pgClient.query(addNewUserQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: addNewUser failed');
            callback(err. null);
        } else {
            console.log('addNewUser completed, results: ', results);
            callback(null, results);
        }
    });
};



const getUserInfo = (username, callback) =>
{
    console.log('getUserInfo function fired, username: ', username);
    let getUserInfoQuery = `SELECT username, wins, losses, games_played, goals_made FROM players WHERE username = '${username}'`;
    pgClient.query(getUserInfoQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: getUserInfoQuery failed');
            callback(err. null);
        } else {
            console.log('getUserInfoQuery results: ', results);
            callback(null, results);
        }
    });
};
// Returns user data for the requested player
// Data is a JavaScript object and contains the following key:value pairs
// { username: 'meow kitty',
//   wins: 5,
//   losses: 0,
//   games_played: 5,
//   goals_made: 13 }



// FUNCTION NEEDED
// updateUserInfo




const getLeaderboards = (callback) =>
{
    console.log('getLeaderboards function');
    let getLeaderboardQuery = 'SELECT username, wins, losses, games_played, goals_made FROM players ORDER BY wins DESC, goals_made DESC LIMIT 10';
    pgClient.query(getLeaderboardQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: getLeaderboardQuery failed');
            callback(err. null);
        } else {
            console.log('getLeaderboardQuery results:', results);
            callback(null, results);
        }
    });
};
// Returns the top 10 players, sorted by wins, and then by goals made
// Data is an array of 10 objects.
// Each object is a JavaScript object and contains the following key:value pairs
// { username: 'meow kitty',
//   wins: 5,
//   losses: 0,
//   games_played: 5,
//   goals_made: 13 }



// FUNCTION NEEDED
// postGameInfo
// handlepost request from game server



// FUNCTION NEEDED
// getGameInfo
// handle get request from client






// OPERATIONS EXAMPLES

// insert single entry
// INSERT INTO players () VALUES ();

// insert multiple entries
// INSERT INTO products (product_no, name, price) VALUES
//     (1, 'Cheese', 9.99),
//     (2, 'Bread', 1.99),
//     (3, 'Milk', 2.99);

// update examples
// UPDATE products SET price = 10 WHERE price = 5;
// UPDATE products SET price = price * 1.10;
// UPDATE mytable SET a = 5, b = 3, c = 1 WHERE a > 0;


module.exports = {
    pgClient,
    addNewUser,
    getUserInfo,
    getLeaderboards
};

// IGNORE FOR NOW

// var pg = require('knex')({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'student',
//         password: 'student',
//         database: 'futyarndb'
//     }
// });

// PGHOST
// PGPORT