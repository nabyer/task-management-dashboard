const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Füge eine Methode zum Schließen der Verbindung hinzu
const dbConnection = {
    query: (text, params) => pool.query(text, params),
    close: () => pool.end(), // Schließt die Datenbankverbindung
};

module.exports = dbConnection;
