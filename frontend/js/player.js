document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (!courseId) {
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
    }
});

function initPlayer(course) {
    document.getElementById('course-title').textContent = course.title;
    const playlist = document.getElementById('playlist');
    const player = document.getElementById('youtube-player');
    const placeholder = document.getElementById('placeholder');
    const lessonTitle = document.getElementById('lesson-title');

    // Load progress
    const progressKey = `academia_progress_${course.id || course._id}`;
    let savedProgress = JSON.parse(localStorage.getItem(progressKey)) || {};
    
    // Clear existing
    playlist.innerHTML = '';

    // Render Playlist
    course.videos.forEach((video, index) => {
        const item = document.createElement('div');
        // Glass Theme Classes
        item.className = 'p-3 mx-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 group flex items-start gap-3 border border-transparent hover:bg-white/5';
        
        const isActive = savedProgress.lastVideoId === video.id;
        
        if (isActive) {
            item.classList.add('bg-neon-purple/10', 'border-neon-purple/30');
        }

        item.innerHTML = `
            <div class="mt-0.5 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${isActive ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/10 text-gray-500'}">
                ${isActive ? '<i data-lucide="play" class="w-3 h-3"></i>' : index + 1}
            </div>
            <div class="flex-1">
                <h4 class="text-sm font-medium leading-snug transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}">${video.title}</h4>
                <p class="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">${video.duration || '10:00'}</p>
            </div>
        `;

        item.addEventListener('click', () => {
            // Reset Siblings
            Array.from(playlist.children).forEach(sib => {
                sib.className = 'p-3 mx-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 group flex items-start gap-3 border border-transparent hover:bg-white/5';
                const iconBox = sib.querySelector('div:first-child');
                const title = sib.querySelector('h4');
                
                // Reset Icon
                const idx = Array.from(playlist.children).indexOf(sib) + 1;
                iconBox.className = 'mt-0.5 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors bg-white/10 text-gray-500';
                iconBox.innerHTML = idx;

                // Reset Text
                title.className = 'text-sm font-medium leading-snug transition-colors text-gray-400 group-hover:text-gray-200';
            });
            
            // Set Active
            item.className = 'p-3 mx-2 mb-2 rounded-lg cursor-pointer transition-all duration-300 group flex items-start gap-3 border border-neon-purple/30 bg-neon-purple/10';
            const activeIconBox = item.querySelector('div:first-child');
            const activeTitle = item.querySelector('h4');
            
            activeIconBox.className = 'mt-0.5 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors bg-neon-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]';
            activeIconBox.innerHTML = '<i data-lucide="play" class="w-3 h-3"></i>';
            
            activeTitle.className = 'text-sm font-medium leading-snug transition-colors text-white';
            
            lucide.createIcons();

            // Update Player
            placeholder.classList.add('hidden');
            
            // Robust YouTube ID Extraction
            // Handles: v=ID, embed/ID, youtu.be/ID, or raw ID
            let vId = video.url;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = video.url.match(regExp);
            if (match && match[2].length == 11) {
                vId = match[2];
            } else {
                // Determine if it looks like a raw ID (11 chars) or fallback
                if(video.url.length === 11) vId = video.url; 
            }

            const embedUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0&modestbranding=1`;
            player.src = embedUrl;
            lessonTitle.textContent = video.title;
            
            // Notes Rendering
            const notesEl = document.getElementById('lesson-notes');
            const downloadBtn = document.getElementById('download-notes-btn');
            
            if(video.notes) {
                // Style overrides for markdown in glass theme
                // We handle this via CSS in player.html mostly, but ensure HTML matches
                notesEl.innerHTML = marked.parse(video.notes);
                downloadBtn.classList.remove('hidden');
                downloadBtn.setAttribute('data-filename', `${video.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
            } else {
                notesEl.innerHTML = '<p class="text-gray-600 italic">No notes available for this module.</p>';
                downloadBtn.classList.add('hidden');
            }

            // Save Progress
            savedProgress.lastVideoId = video.id;
            localStorage.setItem(progressKey, JSON.stringify(savedProgress));
        });

        playlist.appendChild(item);

        // Auto-Play Logic
        if (isActive || (index === 0 && !savedProgress.lastVideoId)) {
             // We don't click() to avoid auto-playing annoying audio on load, 
             // but we do update the UI to show it's selected
             // Actually, for a "Premium" feel, preserving state is key.
             if(isActive) item.click();
        }
    });

    lucide.createIcons();
}

window.downloadNotes = function() {
    const element = document.getElementById('lesson-notes');
    const btn = document.getElementById('download-notes-btn');
    const filename = btn.getAttribute('data-filename') || 'notes.pdf';
    
    // Add temporary class for white background pdf
    element.classList.add('text-black');
    
    const opt = {
        margin: 1,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' }, // Force white bg for PDF
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        element.classList.remove('text-black');
    });
}
