const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'barber_booking',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

console.log('🔧 Connecting to MySQL...');
console.log('   Host:', process.env.DB_HOST || 'localhost');
console.log('   Database:', process.env.DB_NAME || 'barber_booking');
console.log('   User:', process.env.DB_USER || 'root');

const testConnection = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
  console.log(`\nSUCCESS! DATABASE CONNECTED!`);
  console.log(`Users in database: ${rows[0].count}\n`);
};

module.exports = { pool, testConnection };
