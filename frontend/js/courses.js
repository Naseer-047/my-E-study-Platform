document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('course-grid');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/courses`); // Using absolute path from config
        const courses = await response.json();

        loader.classList.add('hidden');
        grid.classList.remove('hidden');

        courses.forEach(course => {
            const card = createCourseCard(course);
            grid.appendChild(card);
        });
        
        lucide.createIcons();

    } catch (error) {
        console.error('Failed to load courses:', error);
        loader.innerHTML = '<p class="text-red-500">Failed to load courses. Is the backend running?</p>';
    }
});

function createCourseCard(course) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col';
    
    // Tech Stack Icons (Mock)
    const techStackHtml = course.techStack ? course.techStack.map(tech => 
        `<span class="text-xs font-mono bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">${tech}</span>`
    ).join('') : '';

    div.innerHTML = `
        <div class="relative h-48 overflow-hidden bg-gray-200">
            <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-classic-charcoal">
                ${course.category}
            </div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
            <div class="mb-4">
                <h3 class="text-xl font-serif font-medium text-gray-900 mb-1 leading-snug">${course.title}</h3>
                <p class="text-sm text-gray-500 font-light">by ${course.instructor}</p>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-6">
                ${techStackHtml}
            </div>

            <div class="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                <span class="text-xs text-gray-400 font-medium">${course.totalVideos} Lessons</span>
                <a href="player.html?id=${course.id}" class="text-sm font-semibold text-classic-charcoal hover:underline flex items-center gap-1">
                    Start Learning <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
    `;
    return div;
}
