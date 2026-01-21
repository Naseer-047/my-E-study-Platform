const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');

// Admin Middleware (Reusable)
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '').trim() === 'admin-secret-123') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }
};

// Public: Get all hackathons
router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ date: 1 });
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create hackathon
router.post('/', isAdmin, async (req, res) => {
  const hackathon = new Hackathon(req.body);
  try {
    const newHackathon = await hackathon.save();
    res.status(201).json(newHackathon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update hackathon
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updated = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete hackathon
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Hackathon.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
