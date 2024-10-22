const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT, 
});

app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/tasks', async (req, res) => {
    const { title, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *',
            [title, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/teams', async (req, res) => {
    const { name, members } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO teams (name, members) VALUES ($1, $2) RETURNING *',
            [name, members]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));