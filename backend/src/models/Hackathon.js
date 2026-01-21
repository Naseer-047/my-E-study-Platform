const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  date: { type: Date, required: true },
  prize: { type: String, default: "TBD" },
  image: { type: String },
  link: { type: String },
  status: { type: String, enum: ['Upcoming', 'Registration Open', 'Ongoing', 'Ended'], default: 'Upcoming' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Hackathon", HackathonSchema);
