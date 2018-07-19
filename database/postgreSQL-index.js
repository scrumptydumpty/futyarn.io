var pg = require('pg');
// var connection = "postgres://userName:password@serverName/ip:port/nameOfDatabase";
// var connection = "postgres://userName:password@servername/ip:port/futyarn.io";
var connection = 'postgres://localhost:5432/futyarn.io';
var pgClient = new pg.Client(connection);

pgClient.connect();

pgClient.on('error', function () 
{
    console.log('postgres connection error');
});

pgClient.once('open', function () 
{
    console.log('postgres connected successfully');
});

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

// FUNCTIONS NEEDED

// addNewUser

// getUserInfo

// updateUserInfo

function getLeaderboard (callback)
{
    let getLeaderboardQuery = 
    'SELECT username, wins, losses, games_played, goals_made FROM players ORDER BY wins DESC, goals_made DESC LIMIT 10';
    pgClient.query(getLeaderboardQuery, (err, results/*, fields*/) => {
        if (err) {
            callback(err. null);
        } else {
            callback(null, results);
        }
    });
}
// Returns the top 10 players, sorted by wins, and then by goals made
// Data is an array of 10 objects.
// Each object is a JavaScript object and contains the following key: value pairs:
// { username: 'meow kitty',
//   wins: 5,
//   losses: 0,
//   games_played: 5,
//   goals_made: 13 }


// addGameInfo

// getGameInfo






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




module.exports.pgClient = pgClient;
module.exports.getLeaderboard = getLeaderboard;


// module.exports = {
//     getLeaderboard
// }