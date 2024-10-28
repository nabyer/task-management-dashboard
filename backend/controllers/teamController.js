const pool = require('../db/pool');
const { teamSchema, partialTeamSchema } = require('../validations/teamValidation');

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
    // Validiere die Eingabedaten
    const { error } = teamSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, members } = req.body; // members ist nun ein Array
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

    const { error } = teamSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

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

// PATCH: Team teilweise akutalisieren
const partailUpdateTeam = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const { error } = partialTeamSchema.validate(updates);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const result = await pool.query(
            'UPDATE teams SET name = COALESCE($1, name), members = COALESCE($2, members) WHERE id = $3 RETURNING *',
            [updates.name, updates.members, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
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
    partailUpdateTeam,
    deleteTeam
};
