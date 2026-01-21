/**
 * Glassmorphism Notification System
 * Handles:
 * 1. Admin Broadcasts (via LocalStorage Sync)
 * 2. New Course Alerts (via API Polling)
 * 3. Course Updates (via timestamp checks)
 */

const NOTIFICATION_KEY = 'academia_notifications';
const COURSE_CACHE_KEY = 'academia_course_cache';

class NotificationSystem {
    constructor() {
        this.navContainer = null;
        this.listContainer = null;
        this.badge = null;
        
        // Initialize if DOM is ready, else wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.injectStyles();
        this.renderBell();
        this.startPolling();
        this.listenForBroadcasts();
        
        // Expose global for Admin Panel
        window.sendSystemNotification = this.broadcast.bind(this);
    }

    injectStyles() {
        const css = `
            .notif-badge {
                position: absolute; top: -2px; right: -2px;
                width: 14px; height: 14px;
                background: #EF4444; color: white;
                font-size: 9px; font-weight: bold;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
                opacity: 0; transition: opacity 0.3s;
            }
            .notif-dropdown {
                position: absolute; top: 70px; right: 20px;
                width: 320px;
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                transform: translateY(-20px); opacity: 0; pointer-events: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                overflow: hidden;
            }
            .notif-dropdown.active {
                opacity: 1; transform: translateY(0); pointer-events: all;
            }
            .notif-item {
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
                transition: background 0.2s; cursor: pointer;
            }
            .notif-item:hover { background: rgba(255,255,255,0.05); }
            .notif-item:last-child { border-bottom: none; }
            .notif-item.unread { background: rgba(79, 70, 229, 0.1); border-left: 3px solid #4F46E5; }
            
            .toast-container {
                position: fixed; bottom: 30px; right: 30px; z-index: 2000;
                display: flex; flex-direction: column; gap: 10px;
            }
            .glass-toast {
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.1);
                border-left: 4px solid #06B6D4;
                color: white; padding: 16px 24px; rounded: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                display: flex; align-items: start; gap: 12px;
                min-width: 300px;
                animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);
        
        const toastC = document.createElement('div');
        toastC.className = 'toast-container';
        document.body.appendChild(toastC);
    }

    renderBell() {
        // Find navbar to inject bell
        const nav = document.querySelector('nav div.flex.items-center.gap-3') || document.querySelector('nav .justify-between');
        if(!nav) return;

        // Create Container relative to existing elements essentially
        // We'll append to the right-side actions
        const rightGroup = document.querySelector('.hidden.md\\:flex.gap-8');
        if(!rightGroup) return;

        const container = document.createElement('div');
        container.className = 'relative ml-6';
        
        container.innerHTML = `
            <button id="bell-btn" class="relative p-2 text-gray-400 hover:text-white transition-colors">
                <i data-lucide="bell" class="w-5 h-5"></i>
                <span class="notif-badge">0</span>
            </button>
            <div class="notif-dropdown">
                <div class="p-4 border-b border-white/5 flex justify-between items-center">
                    <span class="text-sm font-bold text-white tracking-wide">Notifications</span>
                    <button class="text-xs text-neon-cyan hover:text-white" onclick="notifSystem.clearAll()">Clear All</button>
                </div>
                <div id="notif-list" class="max-h-64 overflow-y-auto">
                    <div class="p-8 text-center text-gray-500 text-xs">No new notifications</div>
                </div>
            </div>
        `;

        rightGroup.parentNode.insertBefore(container, rightGroup.nextSibling); // Insert after links
        
        // For Mobile: Add to menu? Simplified for now: Desktop first.
        
        this.navContainer = container;
        this.badge = container.querySelector('.notif-badge');
        this.listContainer = container.querySelector('#notif-list');
        
        const bellBtn = container.querySelector('#bell-btn');
        bellBtn.onclick = (e) => {
            e.stopPropagation();
            container.querySelector('.notif-dropdown').classList.toggle('active');
            this.markAllRead();
        };

        // Close on click outside
        document.addEventListener('click', (e) => {
            if(!container.contains(e.target)) {
                container.querySelector('.notif-dropdown').classList.remove('active');
            }
        });

        // Initial Load
        this.loadFromStorage();
        lucide.createIcons();
    }

    loadFromStorage() {
        const data = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
        this.renderList(data);
    }

    renderList(notifications) {
        if(notifications.length === 0) {
            this.listContainer.innerHTML = '<div class="p-8 text-center text-gray-500 text-xs">No new notifications</div>';
            this.badge.style.opacity = '0';
            return;
        }

        const unreadCount = notifications.filter(n => !n.read).length;
        if(unreadCount > 0) {
            this.badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
            this.badge.style.opacity = '1';
        } else {
            this.badge.style.opacity = '0';
        }

        this.listContainer.innerHTML = notifications.reverse().map(n => `
            <div class="notif-item ${!n.read ? 'unread' : ''}">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-xs font-bold text-neon-cyan uppercase">${n.type}</span>
                    <span class="text-[10px] text-gray-500">${this.timeAgo(n.time)}</span>
                </div>
                <p class="text-sm text-gray-300 leading-snug">${n.message}</p>
            </div>
        `).join('');
    }

    // --- LOGIC ---

    addNotification(type, message) {
        const notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
        const newNotif = {
            id: Date.now(),
            type,
            message,
            time: Date.now(),
            read: false
        };
        
        notifications.push(newNotif);
        // Keep last 20
        if(notifications.length > 20) notifications.shift();
        
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
        this.renderList(notifications);
        this.showToast(type, message);
    }

    showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = 'glass-toast';
        toast.innerHTML = `
            <div class="mt-1"><i data-lucide="bell-ring" class="w-4 h-4 text-neon-cyan"></i></div>
            <div>
                <h4 class="text-xs font-bold text-neon-cyan uppercase mb-1">${type}</h4>
                <p class="text-sm text-white">${message}</p>
            </div>
        `;
        document.querySelector('.toast-container').appendChild(toast);
        lucide.createIcons();
        
        // Sound
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.2;
            audio.play().catch(e=>{});
        } catch(e) {}

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    markAllRead() {
        const notifications = JSON.parse(localStorage.getItem(NOTIFICATION_KEY)) || [];
        const updated = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        this.renderList(updated);
    }

    clearAll() {
        localStorage.removeItem(NOTIFICATION_KEY);
        this.renderList([]);
    }

    // --- POLLING & EVENTS ---

    async startPolling() {
        if(typeof CONFIG === 'undefined') return;
        
        const check = async () => {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/courses`);
                const courses = await res.json();
                
                // Load previous state: { [id]: updatedAtString, ... }
                // We handle legacy array format migration gracefully
                let cachedState = {};
                try {
                     const raw = JSON.parse(localStorage.getItem(COURSE_CACHE_KEY));
                     if(Array.isArray(raw)) {
                         // Migrate legacy array to object (assume now as baseline)
                         raw.forEach(id => cachedState[id] = new Date().toISOString()); 
                     } else {
                         cachedState = raw || {};
                     }
                } catch(e) {}

                const newState = {};
                let hasChanges = false;

                courses.forEach(c => {
                    const id = c.id || c._id;
                    const updated = c.updatedAt || c.createdAt || new Date().toISOString(); // Fallback
                    
                    newState[id] = updated;

                    if (!cachedState[id]) {
                        // NEW COURSE (Only warn if we had a cache, i.e., not first load)
                        if (Object.keys(cachedState).length > 0) {
                             this.addNotification('New Content', `New module added: "${c.title}"`);
                        }
                    } else if (cachedState[id] !== updated) {
                        // UPDATED COURSE
                        // Check time difference to avoid spam on initial migration
                        if (new Date(updated) > new Date(cachedState[id])) {
                             this.addNotification('Course Update', `Module "${c.title}" has been updated.`);
                        }
                    }
                });

                // Update Cache
                if (courses.length > 0) {
                     localStorage.setItem(COURSE_CACHE_KEY, JSON.stringify(newState));
                }

            } catch(e) { console.error("Polling error", e); }
        };

        check();
        setInterval(check, 10000); // Check every 10s
    }

    listenForBroadcasts() {
        // Listen for storage events (Tabs sync)
        window.addEventListener('storage', (e) => {
            if(e.key === NOTIFICATION_KEY) {
                const newData = JSON.parse(e.newValue);
                this.renderList(newData);
                
                // If new unread added recently, toast it
                 const last = newData[newData.length - 1];
                 if(last && !last.read && (Date.now() - last.time < 1000)) {
                      this.showToast(last.type, last.message);
                 }
            }
        });
    }

    // Admin Function
    broadcast(message) {
        this.addNotification('Admin Alert', message);
    }

    // Utils
    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    }
}

const notifSystem = new NotificationSystem();
