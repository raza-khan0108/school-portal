// pages/api/setup-database.js
import { initDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    await initDatabase();
    
    // Add sample data
    const { query } = await import('../../lib/db');
    
    await query(`
      INSERT INTO schools (name, address, city, state, contact, email_id, image) 
      VALUES 
      ('Greenwood High School', '123 Education Street', 'Mumbai', 'Maharashtra', '+912234567890', 'info@greenwood.edu', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-1'),
      ('Sunrise Academy', '456 Learning Road', 'Delhi', 'Delhi', '+911198765432', 'contact@sunriseacademy.in', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-2'),
      ('Valley Public School', '789 Knowledge Avenue', 'Bangalore', 'Karnataka', '+918088776655', 'admin@valleypublic.edu', 'https://res.cloudinary.com/dlib16bmn/image/upload/v1/school-portal/sample-school-3')
    `);

    res.status(200).json({ 
      success: true, 
      message: 'Database setup complete with sample data!' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}