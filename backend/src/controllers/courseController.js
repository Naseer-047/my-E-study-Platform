const CourseService = require('../services/courseService');

class CourseController {
  getAllCourses(req, res) {
    try {
      const courses = CourseService.getAllCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  getCourseById(req, res) {
    try {
      const course = CourseService.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  createCourse(req, res) {
    try {
      const newCourse = CourseService.createCourse(req.body);
      res.status(201).json(newCourse);
    } catch (err) {
      if (err.message.startsWith('Validation Failed')) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Could not create course' });
    }
  }

  updateCourse(req, res) {
    try {
      const updated = CourseService.updateCourse(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  deleteCourse(req, res) {
    try {
      const success = CourseService.deleteCourse(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new CourseController();
