const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/teams', teamRoutes);

// Error-Handling-Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server; // Server-Variable

if (require.main === module) {
    server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
    server = app.listen();
}

const closeServer = () => {
    return new Promise((resolve) => {
        server.close(() => {
            console.log('Server closed');
            resolve();
        });
    });
};

module.exports = { app, closeServer }; // Exportiere die Schließfunktion