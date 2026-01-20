const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');

// Admin Middleware (Simple)
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer admin-secret-123') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }
};

// Public Routes
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Admin Routes
router.post('/', isAdmin, CourseController.createCourse);
router.put('/:id', isAdmin, CourseController.updateCourse);
router.delete('/:id', isAdmin, CourseController.deleteCourse);

module.exports = router;
