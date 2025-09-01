// lib/db.js
import mysql from 'mysql2/promise';

let pool;

// Parse the database URL
function parseDatabaseUrl() {
  const url = process.env.DATABASE_URL || '';
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Parse mysql://user:pass@host:port/database
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }

  return {
    host: match[3],
    port: parseInt(match[4]),
    user: match[1],
    password: match[2],
    database: match[5]
  };
}

export function getPool() {
  if (!pool) {
    const config = parseDatabaseUrl();
    
    console.log('Creating database connection with:', {
      host: config.host,
      user: config.user,
      database: config.database
    });

    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
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
    throw error;
  }
}

// Auto-create table if it doesn't exist
export async function initDatabase() {
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
}

// Initialize on import
initDatabase();