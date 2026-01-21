const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get active alerts (Public)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ createdAt: -1 }).limit(10);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new alert (Admin Protected)
router.post('/', async (req, res) => {
  // Simple protection based on shared secret for now to match other routes
  const token = req.headers.authorization;
  if (!token || !token.includes('admin-secret-123')) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const newAlert = new Alert(req.body);
    const saved = await newAlert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Dismiss alert (Admin Protected)
router.put('/:id', async (req, res) => {
  const token = req.headers.authorization;
  if (!token || !token.includes('admin-secret-123')) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const updated = await Alert.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
