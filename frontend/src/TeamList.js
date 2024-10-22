import React, { useEffect, useState } from 'react';

const TeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/teams')
      .then(response => response.json())
      .then(data => setTeams(data));
  }, []);

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
    </div>
  );
};

export default TeamList;