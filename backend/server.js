const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const tasks = [
    { id: 1, title: 'Build frontend', status: 'In  Progress' },
    { id: 2, title: 'Create API', status: 'Completed' },
    { id: 3, title: 'Design database schema', status: 'Pending' }
];

const teams = [
    { id: 1, name: 'Development', members: ['Alice', 'Bob'] },
    { id: 2, name: 'Design', members: ['Charlie', 'Dave'] }
];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/teams', (req, res) => {
    res.json(teams);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));