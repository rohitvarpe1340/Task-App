const express = require('express');
const app = express();
const cors = require("cors");
const connection= require('./db');

// Middleware
app.use(cors());
app.use(express.json()); 



// Home route
app.get('/', (req, res) => {
    res.send('Welcome to TODO app API!');
});

// Get all tasks
app.get('/get_tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: err.sqlMessage,
                data: []
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Tasks fetched successfully',
                data: rows
            });
        }
    });
});

// Add new task
app.post('/add_task', (req, res) => {
    // console.log("Headers:", req.headers);
    // console.log("Body:", req.body);
    
    const task = req.body.task;

    if (!task || task.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Task cannot be empty!',
            data: []
        });
    }

    const query = 'INSERT INTO tasks (title) VALUES (?)';
    connection.query(query, [task], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.sqlMessage,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task added successfully!',
            data: result.insertId
        });
    });
});

// Update task
app.put('/update_tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = req.body.task;

    if (!task || task.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Task cannot be empty!',
            data: []
        });
    }

    const query = 'UPDATE tasks SET title = ? WHERE id = ?';
    connection.query(query, [task, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.sqlMessage,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully!',
            data: result.affectedRows
        });
    });
});

// Mark task as done or undone
app.put('/update_done/:id', (req, res) => {
    const id = req.params.id;
   const task = req.body.task;

    if (done !== 0 && done !== 1) {
        return res.status(400).json({
            success: false,
            message: 'Done status must be 0 or 1',
            data: []
        });
    }

    const query = 'UPDATE tasks SET done = ? WHERE id = ?';
    connection.query(query, [done, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.sqlMessage,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully!',
            data: result.affectedRows
        });
    });
});

// Delete task
app.delete('/delete_task/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.sqlMessage,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully!',
            data: result.affectedRows
        });
    });
});

// Start server
const port = 8888;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
