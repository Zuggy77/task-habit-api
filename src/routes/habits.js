const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET: Fetch all habits
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM habits ORDER BY created_at DESC');
        const habits = stmt.all();
        res.json({ message: 'success', data: habits });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new habit
router.post('/', (req, res) => {
    try {
        const { name, target_days } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Habit name is required' });
        }

        const stmt = db.prepare('INSERT INTO habits (name, target_days) VALUES (?, ?)');
        const result = stmt.run(name, target_days || 7);

        res.status(201).json({
            message: 'success',
            data: { id: result.lastInsertRowid, name, target_days: target_days || 7 }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Log habit completion for a specific date
router.post('/:id/log', (req, res) => {
    try {
        const { id } = req.params;
        const { completed_date } = req.body; // format: 'YYYY-MM-DD'

        if (!completed_date) {
            return res.status(400).json({ error: 'completed_date is required (YYYY-MM-DD)' });
        }

        const stmt = db.prepare('INSERT INTO habit_logs (habit_id, completed_date) VALUES (?, ?)');
        const result = stmt.run(id, completed_date);

        res.status(201).json({ message: 'success', logId: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;