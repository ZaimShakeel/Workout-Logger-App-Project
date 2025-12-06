const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user exists
        const user = await pool.query("SELECT * FROM \"User\" WHERE email = $1", [email]);
        if (user.rows.length > 0) {
            return res.status(401).json("User already exists!");
        }

        // 2. Bcrypt the password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert valid new user inside our database
        const newUser = await pool.query(
            "INSERT INTO \"User\" (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        // 4. Generate JWT Token
        const token = jwt.sign({ user: newUser.rows[0].userid }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

        return res.json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await pool.query("SELECT * FROM \"User\" WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        // 2. Check if incoming password matches database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        // 3. Give them the token
        const token = jwt.sign({ user: user.rows[0].userid }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        return res.json({ token, user: user.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;