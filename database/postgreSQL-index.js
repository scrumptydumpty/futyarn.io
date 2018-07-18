var postgres = require('pg');
var pg = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'student',
        password: 'student',
        database: 'futyarndb'
    }
});

// PGHOST
// PGPORT

// FUNCTIONS NEEDED

// addNewUser

// getUserInfo

// updateUserInfo

// getLeaderboard

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



//define queries in here on the pg thing (export said methods)
