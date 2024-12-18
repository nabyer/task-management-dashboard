const express = require('express');
const { getTeams, createTeam, updateTeam, partialUpdateTeam, deleteTeam} = require('../controllers/teamController');

const router = express.Router();

router.get('/', getTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.patch('/:id', partialUpdateTeam)
router.delete('/:id', deleteTeam);

module.exports = router;