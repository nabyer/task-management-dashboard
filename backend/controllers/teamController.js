const pool = require('../db/pool');

// GET: Alle Teams abrufen
const getTeams = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teams');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// POST: Neues Team hinzufügen
const createTeam = async (req, res) => {
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
};

// PUT: Team vollständig aktualisieren
const updateTeam = async (req, res) => {
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
};

// DELETE: Team löschen
const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam
};