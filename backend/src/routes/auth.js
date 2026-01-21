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

// Login (Dynamic: Support Email or Username)
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        // Find user by email or username
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ name: username, role: 'Admin' });
        }

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.role === 'Student' && user.status !== 'Approved') {
            return res.status(403).json({ 
                status: user.status,
                message: user.status === 'Pending' 
                    ? 'Your account is pending approval.' 
                    : 'Your account has been rejected.' 
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Seed Admin
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ name: 'Naseer', role: 'Admin' });
        if (!adminExists) {
            const admin = new User({
                name: 'Naseer',
                email: 'admin@academia.edu', // Placeholder
                password: 'Naseer@123',
                role: 'Admin',
                status: 'Approved'
            });
            await admin.save();
            console.log('Admin user (Naseer) seeded successfully.');
        }
    } catch (err) {
        console.error('Admin seeding failed:', err);
    }
};

module.exports = { router, seedAdmin };
