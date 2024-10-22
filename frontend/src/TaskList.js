import React, { useEffect, useState } from 'react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
        .then(response => response.json())
        .then(data => setTasks(data));
    }, []);

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