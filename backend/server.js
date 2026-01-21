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
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/hackathons', require('./src/routes/hackathons'));
app.use('/api/requests', require('./src/routes/requests'));
app.use('/api/comments', require('./src/routes/comments'));
app.use('/api/alerts', require('./src/routes/alerts'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
