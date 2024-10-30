import React, { useEffect, useState } from 'react';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState('');
    const [newMembers, setNewMembers] = useState('');
    const [editTeamId, setEditTeamId] = useState(null);
    const [editTeamName, setEditTeamName] = useState('');
    const [editTeamMembers, setEditTeamMembers] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/teams')
            .then(response => response.json())
            .then(data => setTeams(data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const handleAddTeam = () => {
        if (!newTeam || !newMembers) {
            alert('Bitte fülle alle Felder aus.');
            return;
        }
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
            .catch(error => console.error('Error adding team:', error));
    };

    const handleEditTeam = (team) => {
        setEditTeamId(team.id);
        setEditTeamName(team.name);
        setEditTeamMembers(team.members.join(', '));
    };

    const handleUpdateTeam = () => {
        const teamData = {
            name: editTeamName,
            members: editTeamMembers.split(',').map(member => member.trim()),
        };

        fetch(`http://localhost:5000/teams/${editTeamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
        })
            .then(response => response.json())
            .then(data => {
                const updatedTeams = teams.map(team =>
                    team.id === editTeamId ? data : team
                );
                setTeams(updatedTeams);
                setEditTeamId(null);
                setEditTeamName('');
                setEditTeamMembers('');
            })
            .catch(error => console.error('Error updating team:', error));
    };

    const handleDeleteTeam = (id) => {
        fetch(`http://localhost:5000/teams/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setTeams(teams.filter(team => team.id !== id));
                } else {
                    throw new Error('Failed to delete team');
                }
            })
            .catch(error => console.error('Error deleting team:', error));
    };

    return (
        <div>
            <h2>Teams</h2>
            <ul>
                {teams.map(team => (
                    <li key={team.id}>
                        {team.name} - {team.members.length} members
                        <button onClick={() => handleEditTeam(team)}>Edit</button>
                        <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
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
                placeholder="Members (e.g. Alice, Bob...)"
                value={newMembers}
                onChange={e => setNewMembers(e.target.value)}
            />
            <button onClick={handleAddTeam}>Add Team</button>
            {editTeamId && (
                <div>
                    <h3>Edit Team</h3>
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={editTeamName}
                        onChange={e => setEditTeamName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Members (comma separated)"
                        value={editTeamMembers}
                        onChange={e => setEditTeamMembers(e.target.value)}
                    />
                    <button onClick={handleUpdateTeam}>Update Team</button>
                </div>
            )}
        </div>
    );
};

export default TeamList;