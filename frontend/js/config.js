if (typeof CONFIG === 'undefined') {
     CONFIG = {
        // Auto-detect environment
        API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:5000/api' 
            : 'https://my-e-study-platform.onrender.com/api'
    };
}
