/**
 * Domain Model for Course
 * Enforces data structure and validation rules.
 */
class Course {
    constructor({ id, title, instructor, category, thumbnail, techStack, description, videos = [] }) {
        this.id = id;
        this.title = title;
        this.instructor = instructor;
        this.category = category;
        this.thumbnail = thumbnail || 'https://via.placeholder.com/800x450';
        this.techStack = techStack || [];
        this.description = description || '';
        this.videos = videos;
        this.totalVideos = videos.length;
        this.createdAt = new Date();
    }

    /**
     * Validates the course data.
     * @returns {Array<string>} Array of error messages, empty if valid.
     */
    validate() {
        const errors = [];
        if (!this.title || this.title.length < 3) errors.push("Title must be at least 3 characters.");
        if (!this.instructor) errors.push("Instructor is required.");
        if (!this.category) errors.push("Category is required.");
        return errors;
    }

    /**
     * Converts raw JSON data to Course instance.
     * @param {Object} data 
     */
    static fromJSON(data) {
        return new Course(data);
    }
}

module.exports = Course;
