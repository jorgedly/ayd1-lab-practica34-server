const mysql = require('mysql');

const conn = mysql.createPool({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'beea76427aadaa',
    password: 'f8143e67',
    database: 'heroku_c9303d96c62f57c'
});

module.exports = conn;