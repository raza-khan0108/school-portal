// pages/api/setup.js
import { query } from "../../lib/db";

const SQL = `
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  contact VARCHAR(20),
  image VARCHAR(255),
  email_id VARCHAR(255)
) ENGINE=InnoDB;
`;

export default async function handler(req, res) {
  try {
    await query(SQL);
    const rows = await query("SHOW TABLES LIKE 'schools';");
    res.status(200).json({ ok: true, tableCreated: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
