const CourseService = require('../services/courseService');

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createCourse(req, res) {
    try {
      const newCourse = await CourseService.createCourse(req.body);
      res.status(201).json(newCourse);
    } catch (err) {
      if (err.message.startsWith('Validation Failed')) {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).json({ message: 'Could not create course' });
    }
  }

  async updateCourse(req, res) {
    try {
      const updated = await CourseService.updateCourse(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteCourse(req, res) {
    try {
      const success = await CourseService.deleteCourse(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new CourseController();
