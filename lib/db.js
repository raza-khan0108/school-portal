// lib/db.js
import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    console.log('Creating database connection with:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  console.log('Executing query:', sql);
  
  try {
    const connection = await getPool().getConnection();
    console.log('Database connection established');
    
    try {
      const [rows] = await connection.execute(sql, params);
      console.log('Query successful, rows:', rows.length);
      return rows;
    } finally {
      connection.release();
      console.log('Connection released');
    }
  } catch (error) {
    console.error('Database error:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

// Auto-create table if it doesn't exist
(async function initDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        contact VARCHAR(20),
        email_id VARCHAR(255),
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Schools table ready');
  } catch (error) {
    console.error('Database init error:', error);
  }
})();