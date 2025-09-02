// pages/api/addSchool.js
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

    // If file uploaded → upload to Cloudinary
    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const cloudinaryUpload = () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'school-portal',
              transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });

      const result = await cloudinaryUpload();
      imageUrl = result.secure_url;
    }

    // Insert into Postgres (Neon)
    const insertResult = await query(
      `INSERT INTO schools (name, address, city, state, contact, email_id, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, address, city, state, contact, email_id, imageUrl || null]
    );

    res.status(200).json({ success: true, id: insertResult[0].id, imageUrl });

  } catch (error) {
    console.error('Error in addSchool API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
