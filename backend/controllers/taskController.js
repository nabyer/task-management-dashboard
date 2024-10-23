const pool = require('../db/pool');

// GET: Alle Aufgaben abrufen
const getTasks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// POST: Neue Aufgabe hinzufügen
const createTask = async (req, res) => {
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
};

// PUT: Aufgabe vollständig aktualisieren
const updateTask = async (req, res) => {
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
};

// DELETE: Aufgabe löschen
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};