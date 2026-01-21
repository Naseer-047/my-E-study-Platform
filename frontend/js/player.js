document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (!courseId) {
        alert('No course ID provided');
        window.location.href = 'courses.html';
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/courses/${courseId}`);
        if (!response.ok) throw new Error('Course not found');
        const course = await response.json();

        initPlayer(course);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load course details');
    }
});

function initPlayer(course) {
    document.getElementById('course-title').textContent = course.title;
    const playlist = document.getElementById('playlist');
    const player = document.getElementById('youtube-player');
    const placeholder = document.getElementById('placeholder');
    const lessonTitle = document.getElementById('lesson-title');

    // Load progress from LocalStorage
    const progressKey = `academia_progress_${course.id || course._id}`;
    let savedProgress = JSON.parse(localStorage.getItem(progressKey)) || {};
    
    // Render Playlist
    course.videos.forEach((video, index) => {
        const item = document.createElement('div');
        item.className = 'p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors flex gap-3 group';
        if (savedProgress.lastVideoId === video.id) item.classList.add('active-video');

        item.innerHTML = `
            <div class="mt-1 text-gray-500 group-hover:text-white"><i data-lucide="play-circle" class="w-4 h-4"></i></div>
            <div>
                <h4 class="text-sm font-medium text-gray-300 group-hover:text-white leading-snug">${video.title}</h4>
                <p class="text-xs text-gray-500 mt-1">${video.duration}</p>
            </div>
        `;

        item.addEventListener('click', () => {
            // Update UI
            document.querySelectorAll('.active-video').forEach(el => el.classList.remove('active-video'));
            item.classList.add('active-video');
            
            // Update Player
            placeholder.classList.add('hidden');
            player.src = video.url + "?autoplay=1";
            lessonTitle.textContent = video.title;

            // Save Progress
            savedProgress.lastVideoId = video.id;
            localStorage.setItem(progressKey, JSON.stringify(savedProgress));
        });

        playlist.appendChild(item);

        // Auto-play first video or last watched
        if (index === 0 && !savedProgress.lastVideoId) {
            // Optional: Don't auto-play immediately on load to not annoy, but user might expect it
            // item.click(); 
        } else if (savedProgress.lastVideoId === video.id) {
            item.click();
        }
    });
    
    lucide.createIcons();
}
