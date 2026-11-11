const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const taskRoutes = require('./routes/tasks');
const habitRoutes = require('./routes/habits');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Task & Habit Tracker API is live!' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});