const express = require('express');
const router = express.Router();
const NoteRequest = require('../models/NoteRequest');



// Public: Submit a request
router.post('/', async (req, res) => {
  try {
    const newRequest = new NoteRequest(req.body);
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await NoteRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update status (e.g., mark as Fulfilled)
router.put('/:id', async (req, res) => {
  try {
    const updated = await NoteRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete/Dismiss request
router.delete('/:id', async (req, res) => {
  try {
    await NoteRequest.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
