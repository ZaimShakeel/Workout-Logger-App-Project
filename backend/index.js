const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts'); 
const exerciseRoutes = require('./routes/exercises');
const reportRoutes = require("./routes/reports");


const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Allows server to read JSON from body

// --- ROUTES ---
app.use('/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use("/api/reports", reportRoutes);

// Simple Homepage Route
app.get('/', (req, res) => {
    res.send('Workout Logger Backend is running!');
});

// Database Test Route
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database(), now() as time;');
        res.json({
            status: 'success',
            message: 'Database connected successfully',
            database_name: result.rows[0].current_database,
            current_time: result.rows[0].time
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Database connection failed');
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
