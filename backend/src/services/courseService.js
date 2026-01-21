const CourseRepository = require('../repositories/courseRepository');

class CourseService {
    
    async getAllCourses() {
        return await CourseRepository.getAll();
    }

    async getCourseById(id) {
        return await CourseRepository.getById(id);
    }

    async createCourse(courseData) {
        // Basic validation could go here if not handled by Mongoose schema
        if (!courseData.title) throw new Error('Validation Failed: Title is required');
        
        return await CourseRepository.create(courseData);
    }

    async updateCourse(id, updates) {
        return await CourseRepository.update(id, updates);
    }

    async deleteCourse(id) {
        return await CourseRepository.delete(id);
    }
}

module.exports = new CourseService();
