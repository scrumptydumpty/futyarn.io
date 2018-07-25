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


const storeSession = (session, user_id, username, callback) => {
    console.log(`storeSession fired for username: ${username}, session: ${session}`);
    let storeSessionQuery = `INSERT INTO sessions (session, user_id, username) VALUES ('${session}', ${user_id}, '${username}');`;
    pgClient.query(storeSessionQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: storeSession failed');
            console.log(err);
            callback(err, null);
        } else {
            console.log('storeSession completed, stored session: ', session);
            callback(null, results);
        }
    });
};

const verifySession = (session, callback) => {
    console.log(`verifySession fired session: ${session}`);
    let verifySessionQuery = `SELECT * FROM sessions WHERE session = '${session}';`;
    pgClient.query(verifySessionQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: verifySession failed');
            console.log(err);
            callback(err, null);
        } else {
            console.log('verifySession completed, verified session: ', session);
            callback(null, results);
        }
    });
};

const removeSession = (session, callback) => {
    console.log(`removeSession fired for session: ${session}`);
    let removeSessionQuery = `DELETE FROM sessions WHERE session = '${session}';`;
    pgClient.query(removeSessionQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: removeSession failed');
            console.log(err);
            callback(err, null);
        } else {
            console.log('removeSession completed: removed session: ', session);
            callback(null, results);
        }
    });
};



const addNewUser = (username, password, callback) =>
{
    console.log('addNewUser function fired, username: ', username);
    let addNewUserQuery = `INSERT INTO players (username, password, wins, losses, games_played, goals_made) VALUES ('${username}', '${password}', 0, 0, 0, 0);`;
    pgClient.query(addNewUserQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: addNewUser failed');
            console.log(err);
            callback(err, null);
        } else {
            console.log('addNewUser completed, results: ', results);
            callback(null, results);
        }
    });
};



const getUserInfo = (method, identifier, callback) =>
{
    let getUserInfoQuery;
    if (method === 'username') {
        console.log('getUserInfo function fired, username: ', identifier);
        getUserInfoQuery = `SELECT user_id, username, password, wins, losses, games_played, goals_made FROM players WHERE username = '${identifier}';`;
    } else if (method === 'id') {
        console.log('getUserInfo function fired, id: ', identifier);
        getUserInfoQuery = `SELECT user_id, username, password, wins, losses, games_played, goals_made FROM players WHERE user_id = ${identifier};`;
    }
    pgClient.query(getUserInfoQuery, (err, results/*, fields*/) => {
        // console.log('error ---------------------------------------');
        // console.log(err);
        if (err) {
            console.log('error: getUserInfo failed');
            console.log(err);
            callback(err, null);
        } else {
            const foundUser = results.rows[0];
            console.log('getUserInfoQuery results: ', foundUser);
            callback(null, foundUser);
        }
    });
};
// Returns user data for the requested player
// DOES NOT RETRIEVE PASSWORD INFO
// Data is a JavaScript object and contains the following key:value pairs
// { user_id: 1,
//   username: 'meow kitty',
//   wins: 5,
//   losses: 0,
//   games_played: 5,
//   goals_made: 13 }



// FUNCTION NEEDED
// updateUserInfo




const getLeaderboards = (callback) =>
{
    console.log('getLeaderboards function');
    let getLeaderboardQuery = 'SELECT username, wins, losses, games_played, goals_made FROM players ORDER BY wins DESC, goals_made DESC LIMIT 10;';
    pgClient.query(getLeaderboardQuery, (err, results/*, fields*/) => {
        if (err) {
            console.log('error: getLeaderboardQuery failed');
            console.log(err);
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




module.exports = {
    pgClient,
    storeSession,
    verifySession,
    removeSession,
    addNewUser,
    getUserInfo,
    getLeaderboards
};
