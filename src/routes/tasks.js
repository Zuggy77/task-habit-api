const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET: Fetch all tasks
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
        const tasks = stmt.all();
        res.json({ message: 'success', data: tasks });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new task
router.post('/', (req, res) => {
    try {
        const { title, description, priority } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        const stmt = db.prepare('INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)');
        const result = stmt.run(title, description || '', priority || 'medium');

        res.status(201).json({
            message: 'success',
            data: { id: result.lastInsertRowid, title, description, status: 'pending', priority: priority || 'medium' }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Update task status or details
router.put('/:id', (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const { id } = req.params;

        const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const stmt = db.prepare(`UPDATE tasks SET 
            title = ?,
            description = ?,
            status = ?,
            priority = ?
            WHERE id = ?`);
        
        stmt.run(
            title !== undefined ? title : existing.title,
            description !== undefined ? description : existing.description,
            status !== undefined ? status : existing.status,
            priority !== undefined ? priority : existing.priority,
            id
        );

        res.json({ message: 'success', updatedId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a task
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'deleted', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;