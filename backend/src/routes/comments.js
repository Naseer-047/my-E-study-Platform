const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { isAdmin } = require('../middleware/auth');

// Get comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new comment
router.post('/', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get all comments (Moderation)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete a comment
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
