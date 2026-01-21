const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  category: String,
  thumbnail: String,
  description: String,
  totalVideos: { type: Number, default: 0 },
  videos: [
    {
      title: String,
      url: String,
      duration: String,
      notes: String
    }
  ],
}, { timestamps: true });

// Calculate totalVideos before saving, just in case
CourseSchema.pre('save', function(next) {
    if (this.videos) {
        this.totalVideos = this.videos.length;
    }
    next();
});

module.exports = mongoose.model("Course", CourseSchema);
