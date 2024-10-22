import React from "react";
import TaskList from "./TaskList";
import TeamList from "./TeamList";

const Dashboard = () => {
    return (
        <div>
            <h1>Task Management Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <TaskList />
                <TeamList />
            </div>
        </div>
    );
};

export default Dashboard;