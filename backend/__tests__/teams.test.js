const request = require('supertest');
const { app, closeServer } = require('../server');
const dbConnection = require('../db/pool');

describe('Team API', () => {
    let teamId;

    beforeAll(async () => {
        const response = await dbConnection.query('INSERT INTO teams (name, members) VALUES ($1, $2) RETURNING id', ['Team A', ['Member1', 'Member2']]);
        teamId = response.rows[0].id;
    });

    afterAll(async () => {
        await dbConnection.query('DELETE FROM teams WHERE id = $1', [teamId]);
        await closeServer();
        await dbConnection.close();
    });

    it('GET /teams - sollte alle Teams abrufen', async () => {
        const response = await request(app).get('/teams');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /teams - sollte ein neues Team hinzufügen', async () => {
        const newTeam = {
            name: 'Neues Team',
            members: ['Mitglied1', 'Mitglied2'],
        };
        const response = await request(app).post('/teams').send(newTeam);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newTeam.name);
        expect(response.body.members).toEqual(expect.arrayContaining(newTeam.members));
    });

    it('PUT /teams/:id - sollte ein Team vollständig aktualisieren', async () => {
        const updatedTeam = {
            name: 'Aktualisiertes Team',
            members: ['Mitglied3', 'Mitglied4'],
        };
        const response = await request(app).put(`/teams/${teamId}`).send(updatedTeam);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedTeam.name);
        expect(response.body.members).toEqual(expect.arrayContaining(updatedTeam.members));
    });

    it('PATCH /teams/:id - sollte ein Team teilweise aktualisieren', async () => {
        const partialUpdate = {
            members: ['Mitglied5'],
        };
        const response = await request(app).patch(`/teams/${teamId}`).send(partialUpdate);
        expect(response.statusCode).toBe(200);
        expect(response.body.members).toEqual(expect.arrayContaining(partialUpdate.members));
    });

    it('DELETE /teams/:id - sollte ein Team löschen', async () => {
        const response = await request(app).delete(`/teams/${teamId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', teamId);
    });
});