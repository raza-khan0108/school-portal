import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const rows = await query(
      "SELECT id, name, address, city, state, contact, email_id, image FROM schools ORDER BY id DESC"
    );
    res.status(200).json({ success: true, schools: rows });
  } catch (error) {
    console.error('Error in getSchools:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}