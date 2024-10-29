import React, { useEffect, useState } from 'react';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskStatus, setEditTaskStatus] = useState('');

    const statusOptions = ['pending', 'in progress', 'completed'];

    useEffect(() => {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const handleAddTask = () => {
        if (!newTask || !newStatus) {
            alert('Bitte fülle alle Felder aus.');
            return;
        }
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTasks([...tasks, data]);
                setNewTask('');
                setNewStatus('');
            })
            .catch(error => console.error('Error adding task:', error));
    };

    const handleEditTask = (task) => {
        setEditTaskId(task.id);
        setEditTaskTitle(task.title);
        setEditTaskStatus(task.status);
    };

    const handleUpdateTask = () => {
        fetch(`http://localhost:5000/tasks/${editTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: editTaskTitle, status: editTaskStatus }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const updatedTasks = tasks.map(task =>
                    task.id === editTaskId ? data : task
                );
                setTasks(updatedTasks);
                setEditTaskId(null);
                setEditTaskTitle('');
                setEditTaskStatus('');
            })
            .catch(error => console.error('Error updating task:', error));
    };

    const handleDeleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setTasks(tasks.filter(task => task.id !== id));
                } else {
                    throw new Error('Failed to delete task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <strong>{task.title}</strong> - {task.status}
                        <button onClick={() => handleEditTask(task)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="">Select Status</option>
                {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <button onClick={handleAddTask}>Add Task</button>
            {editTaskId && (
                <div>
                    <h3>Edit Task</h3>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={editTaskTitle}
                        onChange={e => setEditTaskTitle(e.target.value)}
                    />
                    <select value={editTaskStatus} onChange={e => setEditTaskStatus(e.target.value)}>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button onClick={handleUpdateTask}>Update Task</button>
                </div>
            )}
        </div>
    );
};

export default TaskList;