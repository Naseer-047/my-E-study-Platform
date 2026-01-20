const CourseRepository = require('../repositories/courseRepository');
const Course = require('../models/Course');

class CourseService {
    
    /**
     * Retrieve all courses.
     * @returns {Array<Course>}
     */
    getAllCourses() {
        const rawData = CourseRepository.getAll();
        return rawData.map(data => Course.fromJSON(data));
    }

    /**
     * Find a course by ID.
     * @param {string} id 
     * @returns {Course|null}
     */
    getCourseById(id) {
        const data = CourseRepository.getById(id);
        if (!data) return null;
        return Course.fromJSON(data);
    }

    /**
     * Create a new course.
     * @param {Object} courseData 
     * @returns {Course} The created course
     * @throws {Error} If validation fails
     */
    createCourse(courseData) {
        const course = new Course(courseData);
        // If ID is not present, Repo will handle it. or we generate here.
        // Let's defer to Repo for ID generation to avoid conflicts/complexity here.
        
        const errors = course.validate();
        if (errors.length > 0) {
            throw new Error(`Validation Failed: ${errors.join(', ')}`);
        }

        return CourseRepository.create(course);
    }

    updateCourse(id, updates) {
        return CourseRepository.update(id, updates);
    }

    deleteCourse(id) {
        return CourseRepository.delete(id);
    }
}

module.exports = new CourseService();
