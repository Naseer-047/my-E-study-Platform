const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  courseId: { type: String, required: true }, // Usually ObjectID but keeping string for flexibility
  videoId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
