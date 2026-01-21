// Premium Academic Theme Configuration
// usage: <script src="frontend/js/theme.js"></script> BEFORE tailwind cdn if possible, or just used to init.
// Actually, for CDN, we should set tailwind.config object.

tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Backgrounds
                paper: '#F9F8F4',       // Warm Alabaster
                'paper-dark': '#F5F2EB', // Slightly darker for cards
                
                // Typography
                ink: {
                    900: '#1A202C',     // Deep Charcoal (Primary)
                    700: '#2D3748',     // Secondary
                    500: '#718096',     // Muted
                    400: '#A0AEC0',     // Subtle
                },

                // Accents
                academic: {
                    navy: '#2C3E50',
                    green: '#2F855A',
                    gold: '#C5A059'
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
            }
        }
    }
}
