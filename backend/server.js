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

// GET: Alle Aufgaben abrufen
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET: Alle Teams abrufen
app.get('/teams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST: Neue Aufgabe hinzufügen
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

// POST: Neues Team hinzufügen
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

// PUT: Vollständige Aktualisierung einer Aufgabe
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, status = $2 WHERE id = $3 RETURNING *',
            [title, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PATCH: Teilweise Aktualisierung einer Aufgabe
app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;

    const updates = [];
    const values = [];

    if (title) {
        updates.push(`title = $${updates.length + 1}`);
        values.push(title);
    }

    if (status) {
        updates.push(`status = $${updates.length + 1}`);
        values.push(status);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${updates.length +1} RETURNING *`;
    values.push(id);

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT: VOllständige Aktualisierung eines Teams
app.put('/teams/:id', async (req, res) => {
    const { id } = req.params;
    const { name, members } = req.body;

    try {
        const result = await pool.query(
            'UPDATE teams SET name = $1, members = $2 WHERE id = $3 RETURNING *',
            [name, members, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PATCH: Teilweise Akutalisierung eines Teams
app.patch('/teams/:id', async (req, res) => {
    const { id } = req.params;
    const { name, members } = req.body;

    const updates = [];
    const values = [];

    if (name) {
        updates.push(`name = $${updates.length + 1}`);
        values.push(name);
    }
    if (members) {
        updates.push(`members = $${updates.length + 1}`);
        values.push(members);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `UPDATE teams SET ${updates.join(', ')} WHERE id = $${updates.length + 1} RETURNING *`;
    values.push(id);

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE: Aufgabe löschen
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// DELETE: Teams löschen
app.delete('/teams/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM teams WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));