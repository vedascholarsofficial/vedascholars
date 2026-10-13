const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const { getConfig } = require('./config/env');
const { configurePassport } = require('./config/passport');
const { rejectOperatorKeys, createLimiters } = require('./middlewares/securityMiddleware');

// Builds a configured Express app. Configuration is validated first, so a
// missing or weak JWT_SECRET stops the server instead of weakening it.
const createApp = () => {
    const config = getConfig();
    const limiters = createLimiters();
    const passport = configurePassport();

    const app = express();
    app.disable('x-powered-by');
    // Number of reverse proxies in front of the API (0 when exposed directly).
    // Needed for correct client IPs in rate limiting; see .env.example.
    app.set('trust proxy', config.trustProxyHops);

    app.use(helmet());
    app.use(
        cors({
            origin(origin, callback) {
                // Requests without an Origin header (server-to-server, curl,
                // same-origin navigation) are not subject to CORS.
                if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
                callback(null, false);
            },
        })
    );
    app.use(express.json({ limit: '100kb' }));
    app.use(rejectOperatorKeys);
    app.use('/api', limiters.general);
    app.use(passport.initialize());

    app.get('/api/health', (req, res) => {
        res.status(200).send('Server is running');
    });

    app.use('/api/auth', require('./routes/authRoutes')(limiters));
    app.use('/api/user', require('./routes/userRoutes')(limiters));
    app.use('/api/jobs', require('./routes/jobRoutes'));
    app.use('/api/applications', require('./routes/applicationRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes')(limiters));
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    app.use('/api/admin', require('./routes/analyticsRoutes'));
    app.use('/api/universities', require('./routes/universityRoutes'));

    app.use('/api', (req, res) => {
        res.status(404).json({ message: 'Not found.' });
    });

    // Central error handler: log the error type, never return internals.
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5 MB).' : 'Invalid file upload.';
            return res.status(400).json({ message });
        }
        if (err && err.expose && err.status && err.status < 500) {
            return res.status(err.status).json({ message: err.type === 'entity.too.large' ? 'Request is too large.' : 'Invalid request.' });
        }
        if (err && err.statusCode === 400) {
            return res.status(400).json({ message: err.message });
        }
        console.error('Unhandled error:', err && (err.name || err.code));
        res.status(500).json({ message: 'Server Error' });
    });

    return app;
};

module.exports = { createApp };
