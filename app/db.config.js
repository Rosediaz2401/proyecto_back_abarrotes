const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'pimpones123',
    database:'abarrotes_don_rufino',
    port:'5432'
})

module.exports = pool;