const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { isAdmin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User Status (Admin only)
router.put('/:id/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: `User ${status}`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
