// pages/api/addSchool.js
import multer from "multer";
import { query } from "../../lib/db";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "public/schoolImages/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse multipart form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    upload.single("image")(req, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the form data
    await parseForm(req);

    const { name, address, city, state, contact, email_id } = req.body;
    
    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    let imagePath = "";
    if (req.file) {
      // Generate a unique filename to avoid conflicts
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname);
      const filename = `school-${uniqueSuffix}${ext}`;
      const newPath = path.join("public/schoolImages/", filename);
      
      // Move the file to the final location
      fs.renameSync(req.file.path, newPath);
      imagePath = `/schoolImages/${filename}`;
    }

    // Insert into database
    const result = await query(
      "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, email_id, imagePath]
    );

    res.status(200).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Error in addSchool API:", err);
    res.status(500).json({ success: false, error: err.message || "Database error" });
  }
}