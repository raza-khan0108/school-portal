// pages/api/db-test.js
import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const rows = await query("SELECT 1 + 1 AS sum");
    res.status(200).json({ ok: true, result: rows[0].sum }); // should be 2
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
