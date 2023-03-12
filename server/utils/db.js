const {createPool} = require('mysql2/promise');

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'republika_db',
    namedPlaceholders: true,
});

pool.getConnection(function (err) {
    if(err){
        console.log("error occurred while connecting");
    }
    else{
        console.log("connection created with Mysql successfully");
    }
});

module.exports = {
    pool,
};