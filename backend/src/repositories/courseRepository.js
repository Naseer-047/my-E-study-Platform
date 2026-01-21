const Course = require('../models/Course');

class CourseRepository {
  
  async getAll() {
    return await Course.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    // Check if valid ObjectId to prevent CastError
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return await Course.findById(id);
    }
    return null;
  }

  async create(courseData) {
    const course = new Course(courseData);
    return await course.save();
  }

  async update(id, updates) {
    return await Course.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id) {
    const result = await Course.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = new CourseRepository();
