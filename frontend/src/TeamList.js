import React, { useEffect, useState } from 'react';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [newMembers, setNewMembers] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/teams')
      .then(response => response.json())
      .then(data => setTeams(data));
  }, []);

  const handleAddTeam = () => {
    const teamData = {
      name: newTeam,
      members: newMembers.split(',').map(member => member.trim()),
    };

    fetch('http://localhost:5000/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    })
    .then(response => response.json())
    .then(data => {
      setTeams([...teams, data]);
      setNewTeam('');
      setNewMembers('');
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            {team.name} - {team.members.length} members
          </li>
        ))}
      </ul>
      <h3>Add New Team</h3>
      <input
        type="text"
        placeholder="Team Name"
        value={newTeam}
        onChange={e => setNewTeam(e.target.value)}
      />
      <input
        type="text"
        placeholder="Members (comma separated)"
        value={newMembers}
        onChange={e => setNewMembers(e.target.value)}
      />
      <button onClick={handleAddTeam}>Add Team</button>
    </div>
  );
};

export default TeamList;