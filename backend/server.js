require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Database Connection
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/academia_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
const { router: authRoutes, seedAdmin } = require('./src/routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./src/routes/users'));

seedAdmin();

// Protection Middleware (Optional: Add for content safety)
const isApprovedStudent = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });
        
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret_123');
        
        // Admin exception
        if (decoded.role === 'Admin') return next();

        const User = require('./src/models/User');
        const user = await User.findById(decoded.id);

        if (!user || user.status !== 'Approved') {
            return res.status(403).json({ message: 'Access denied: Account not approved.' });
        }
        next();
    } catch (e) { res.status(401).json({ message: 'Invalid session' }); }
};

app.use('/api/courses', isApprovedStudent, require('./src/routes/courses'));
app.use('/api/hackathons', isApprovedStudent, require('./src/routes/hackathons'));
app.use('/api/requests', isApprovedStudent, require('./src/routes/requests'));
app.use('/api/comments', isApprovedStudent, require('./src/routes/comments'));
app.use('/api/alerts', isApprovedStudent, require('./src/routes/alerts'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
