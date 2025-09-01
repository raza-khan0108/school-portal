import { query } from '../../lib/db';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import stream from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.single('image');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { name, address, city, state, contact, email_id } = req.body;
    
    let imageUrl = '';
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'school-portal',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ success: false, error: 'Image upload failed' });
          }
          
          imageUrl = result.secure_url;

          try {
            // Insert school data into database
            const result = await query(
              'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [name, address, city, state, contact, email_id, imageUrl]
            );

            res.status(200).json({ success: true, id: result.insertId, imageUrl });
          } catch (dbError) {
            console.error('Database error:', dbError);
            res.status(500).json({ success: false, error: 'Database error' });
          }
        }
      );

      // Create buffer stream and pipe to Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      bufferStream.pipe(uploadStream);
      
    } else {
      // No image provided, insert without image
      const result = await query(
        'INSERT INTO schools (name, address, city, state, contact, email_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, email_id]
      );

      res.status(200).json({ success: true, id: result.insertId });
    }

  } catch (error) {
    console.error('Error in addSchool API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}