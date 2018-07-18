var pg = require('pg');
// var connection = "postgres://userName:password@serverName/ip:port/nameOfDatabase";
// var connection = "postgres://userName:password@servername/ip:port/futyarn.io";
var connection = 'postgres://localhost/futyarn.io';
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

// getLeaderboard
function getLeaderboard (callback)
{
    let getLeaderboardQuery = 
        'SELECT * FROM players ORDER BY wins DESC, goals_made DESC LIMIT 5';
        // 'SELECT array_to_json(array_agg(SELECT players ORDER BY wins DESC, goals_made DESC LIMIT 5)) FROM players';
     pgClient.query(getLeaderboardQuery, (err, results, fields) => {
         if (err) {
             callback(err. null);
         } else {
             callback(null, results);
         }
     });
}


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




module.exports.getLeaderboard = getLeaderboard;

// module.exports = {
//     getLeaderboard
// }