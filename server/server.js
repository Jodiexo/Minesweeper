const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create users table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    top_time INTEGER,
    difficulty VARCHAR(10)
  )
`);

// Login (or create user if not exists)
app.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    let result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      result = await pool.query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user's top time and difficulty
app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { top_time, difficulty } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET top_time = $1, difficulty = $2 WHERE username = $3 RETURNING *',
      [top_time, difficulty, username]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's top time and difficulty
app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query('SELECT top_time, difficulty FROM users WHERE username = $1', [username]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});