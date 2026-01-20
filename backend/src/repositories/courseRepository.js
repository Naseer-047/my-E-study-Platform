const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/courses.json');

class CourseRepository {
  constructor() {
    this.courses = [];
    this.loadData();
  }

  loadData() {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      this.courses = JSON.parse(data);
    } catch (err) {
      console.error("Error loading course data:", err);
      this.courses = [];
    }
  }

  getAll() {
    return this.courses;
  }

  getById(id) {
    return this.courses.find(c => c.id === id);
  }

  create(course) {
    const newCourse = { ...course, id: course.id || `c${Date.now()}` };
    this.courses.push(newCourse);
    this.saveData();
    return newCourse;
  }

  update(id, updates) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.courses[index] = { ...this.courses[index], ...updates };
    this.saveData();
    return this.courses[index];
  }

  delete(id) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.courses.splice(index, 1);
    this.saveData();
    return true;
  }

  saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.courses, null, 2));
  }
}

module.exports = new CourseRepository();
