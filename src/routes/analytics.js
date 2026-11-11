const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET: Summary analytics for tasks and habits
router.get('/', (req, res) => {
    try {
        const taskStats = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM tasks 
            GROUP BY status
        `).all();

        const habitStats = db.prepare(`
            SELECT h.id, h.name, COUNT(hl.id) as total_completions
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id
            GROUP BY h.id
        `).all();

        res.json({
            message: 'success',
            analytics: {
                tasks: taskStats,
                habits: habitStats
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
