const request = require('supertest');
const { app, closeServer } = require('../server');
const dbConnection = require('../db/pool');

describe('Task API', () => {
    let taskId;

    beforeAll(async () => {
        const response = await dbConnection.query('INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING id', ['Test Task', 'pending']);
        taskId = response.rows[0].id;
    });

    afterAll(async () => {
        await dbConnection.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        await closeServer();
        await dbConnection.close();
    });

    it('GET /tasks - sollte alle Aufgaben abrufen', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /tasks - sollte eine neue Aufgabe hinzufügen', async () => {
        const newTask = {
            title: 'Neue Aufgabe',
            status: 'pending',
        };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.status).toBe(newTask.status);
    });

    it('PUT /tasks/:id - sollte eine Aufgabe vollständig aktualisieren', async () => {
        const updatedTask = {
            title: 'Aktualisierte Aufgabe',
            status: 'completed',
        };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
        expect(response.body.status).toBe(updatedTask.status);
    });

    it('PATCH /tasks/:id - sollte eine Aufgabe teilweise aktualisieren', async () => {
        const partialUpdate = {
            status: 'in progress',
        };
        const response = await request(app).patch(`/tasks/${taskId}`).send(partialUpdate);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(partialUpdate.status);
    });

    it('DELETE /tasks/:id - sollte eine Aufgabe löschen', async () => {
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', taskId);
    });
});