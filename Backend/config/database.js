const sql = require('mssql');

const config = {
  server: 'localhost',
  port: 1433,
  database: 'barber_booking_system1',
  user: 'barber_admin',
  password: 'Barber@2026!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS'
  },
  connectionTimeout: 60000,
  requestTimeout: 60000
};

console.log('🔧 Connecting to SQL Server...');
console.log('   Server: localhost:1433');
console.log('   Database:', config.database);
console.log('   User:', config.user);
console.log('   Auth: SQL Authentication');

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('\nSUCCESS! DATABASE CONNECTED!\n');
    return pool;
  })
  .catch(err => {
    console.error('\nConnection Failed!');
    console.error('Error:', err.message);
    process.exit(1);
  });

const testConnection = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT COUNT(*) as count FROM users');
    console.log(`Test Success - Users in database: ${result.recordset[0].count}\n`);
  } catch (error) {
    console.error('Test failed:', error.message);
    throw error;
  }
};

module.exports = { 
  sql, 
  poolPromise, 
  testConnection 
};