import React from "react";
import TaskList from "./TaskList";
import TeamList from "./TeamList";

const Dashboard = () => {
    const tasks = [
        { id: 1, title: 'Build frontend', status: 'In Progress' },
        { id: 2, title: 'Create API', status: 'Completed' },
        { id: 3, title: 'Design databse schema', status: 'Pending' }
    ];

    const teams = [
        { id: 1, name: 'Development', members: ['Alice', 'Bob'] },
        { id: 2, name: 'Design', members: ['Charlie', 'Dave'] }
    ];

    return (
        <div>
            <h1>Task Management Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <TaskList tasks={tasks} />
                <TeamList teams={teams} />
            </div>
        </div>
    );
};

export default Dashboard;