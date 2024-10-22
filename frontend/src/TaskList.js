import React, { useEffect, useState } from 'react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
        .then(response => response.json())
        .then(data => setTasks(data));
    }, []);

    const handleAddTask = () => {
        const taskData = {
            title: newTask,
            status: newStatus,
        };

        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => response.json())
        .then(data => {
            setTasks([...tasks, data]);
            setNewTask('');
            setNewStatus('');
        })
        .catch(error => console.error('Error:', error));
    };

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
            <h3>Add New Task</h3>
            <input
                type="text"
                placeholder="Task Title"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
            />
            <input
                type="text"
                placeholder="Status"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
};

export default TaskList;