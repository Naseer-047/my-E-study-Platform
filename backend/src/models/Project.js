const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teamMembers: { type: String, required: true }, // Comma separated names
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80' },
  link: { type: String }, // GitHub or Demo link
  tags: { type: String }, // e.g., "Web, AI, Hardware"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
