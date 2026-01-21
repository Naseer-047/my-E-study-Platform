const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret_123';

const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'Admin') {
            req.user = decoded;
            return next();
        }
        res.status(403).json({ message: 'Forbidden: Admin access only' });
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};

module.exports = { isAdmin };
