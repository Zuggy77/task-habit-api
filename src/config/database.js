const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize Tables
function initDatabase() {
    // Tasks Table
    db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`).run();

    // Habits Table
    db.prepare(`CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_days INTEGER DEFAULT 7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`).run();

    // Habit Logs Table (for daily tracking & analytics)
    db.prepare(`CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER,
        completed_date TEXT NOT NULL,
        FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
    )`).run();

    console.log('Connected to SQLite database and tables verified.');
}

initDatabase();

module.exports = db;