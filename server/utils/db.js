const {createPool} = require('mysql2/promise');

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'republika_db',
    namedPlaceholders: true,
});

module.exports = {
    pool,
};