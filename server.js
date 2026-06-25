const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize database table if it doesn't exist
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
};
initDb();

app.get('/', async (req, res) => {
  try {
    // Insert a new visit row
    await pool.query('INSERT INTO visits DEFAULT VALUES');
    // Count total visits
    const { rows } = await pool.query('SELECT COUNT(*) FROM visits');
    
    res.send(`
      <body style="font-family: sans-serif; text-align: center; background: #f4f7f6; padding-top: 50px;">
        <h1 style="color: #2e7d32;">🚀 Live Automated Deployment Successful!</h1>
        <p style="font-size: 1.2rem;">This full-stack app was shipped via GitHub Actions.</p>
        <div style="background: white; display: inline-block; padding: 20px 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2>Total Page Visits Captured in DB: <span style="color: #1565c0;">${rows[0].count}</span></h2>
        </div>
      </body>
    `);
  } catch (err) {
    res.status(500).send("Database connection error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
