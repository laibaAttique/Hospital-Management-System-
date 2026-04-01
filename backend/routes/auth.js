const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// POST /api/auth/signup - Patient registration
router.post('/signup', async (req, res) => {
    try {
        const { username, full_name, email, phone, password } = req.body;

        // Validate input
        if (!username || !full_name || !email || !password) {
            return res.status(400).json({
                message: 'Username, full name, email, and password are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if username already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            const field = existingUsers[0].username === username ? 'Username' : 'Email';
            return res.status(409).json({ message: `${field} already exists` });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with 'user' role
        const [result] = await db.query(
            'INSERT INTO users (username, full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [username, full_name, email, phone || null, hashedPassword, 'user']
        );

        // Generate JWT token
        const token = jwt.sign(
            {
                id: result.insertId,
                username,
                role: 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.insertId,
                username,
                full_name,
                email,
                phone,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login - User login (existing route)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user in database
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token with user info
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
