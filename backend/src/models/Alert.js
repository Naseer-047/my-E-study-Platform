const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: { type: String, default: "Admin Alert" },
  message: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Alert", AlertSchema);
