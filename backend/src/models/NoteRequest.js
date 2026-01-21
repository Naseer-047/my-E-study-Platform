const mongoose = require("mongoose");

const NoteRequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  email: { type: String }, // Optional, to notify the student
  status: { type: String, enum: ['Pending', 'Fulfilled', 'Dismissed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model("NoteRequest", NoteRequestSchema);
