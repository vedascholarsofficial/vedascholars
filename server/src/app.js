const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport'); // Direct hook initialized

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Express Session requirement for Passport callbacks specifically
app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-veda-secret-key-32',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Only set true if HTTPS
}));

// Initialize Local Passport arrays physically
app.use(passport.initialize());
app.use(passport.session());

// Basic test route
app.get('/api/health', (req, res) => {
    res.status(200).send('Server is running');
});

// Import other routes here as project grows
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const universityRoutes = require('./routes/universityRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', analyticsRoutes);
app.use('/api/universities', universityRoutes);

module.exports = app;
