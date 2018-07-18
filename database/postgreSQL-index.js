var postgres = require('pg');
var pg = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'student',
    password: 'student',
    database: 'futyarndb'
  }
})

//define queries in here on the pg thing (export said methods)
