import React from "react";

const TaskList = ({ tasks }) => {
    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> - {task.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;