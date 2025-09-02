// pages/api/test-connection.js
import { query } from '../../lib/db';

export default async function handler(req, res) {
  try {
    console.log('Testing database connection...');

    // Postgres returns rows as objects
    const result = await query('SELECT 1 + 1 AS solution');

    res.status(200).json({
      success: true,
      solution: result[0].solution,
      message: 'Database connection successful!'
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
