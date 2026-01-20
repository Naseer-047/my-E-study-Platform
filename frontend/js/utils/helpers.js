/**
 * Formats a duration string (e.g. "10:05") into a human readable format or checks validity.
 * Currently just a pass-through but prepared for future complexity.
 * @param {string} time 
 */
export function formatDuration(time) {
    return time || "00:00";
}

/**
 * Truncates text to a specific length.
 * @param {string} text 
 * @param {number} maxLength 
 */
export function truncate(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Generates a random color class for tags (mock logic).
 */
export function getRandomTagColor() {
    const colors = ['bg-blue-50 text-blue-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600'];
    return colors[Math.floor(Math.random() * colors.length)];
}
