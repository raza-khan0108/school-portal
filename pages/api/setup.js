// pages/api/setup.js
import { query } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Setting up database...');
    
    // Create schools table
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

    console.log('Table created successfully');
    
    // Check if table is empty
    const existingSchools = await query('SELECT COUNT(*) as count FROM schools');
    
    if (existingSchools[0].count === 0) {
      // Insert sample data only if table is empty
      await query(`
        INSERT INTO schools (name, address, city, state, contact, email_id, image) 
        VALUES 
        ('Greenwood High School', '123 Education Street', 'Mumbai', 'Maharashtra', '+912234567890', 'info@greenwood.edu', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-1'),
        ('Sunrise Academy', '456 Learning Road', 'Delhi', 'Delhi', '+911198765432', 'contact@sunriseacademy.in', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-2'),
        ('Valley Public School', '789 Knowledge Avenue', 'Bangalore', 'Karnataka', '+918088776655', 'admin@valleypublic.edu', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-3')
      `);
      console.log('Sample data inserted');
    }

    res.status(200).json({ 
      success: true, 
      message: 'Database setup complete!',
      tableCreated: true,
      dataInserted: existingSchools[0].count === 0
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}