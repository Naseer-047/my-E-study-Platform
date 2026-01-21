const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret_123';

// Register Student
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Student
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.status !== 'Approved') {
            return res.status(403).json({ 
                status: user.status,
                message: user.status === 'Pending' 
                    ? 'Your account is pending approval.' 
                    : 'Your account has been rejected.' 
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
