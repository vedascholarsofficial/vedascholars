const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Rejects request bodies containing MongoDB operator keys ("$gt", "$ne", ...)
// or dotted keys, which would otherwise reach Mongoose filters unchanged.
const hasOperatorKey = (value, depth = 0) => {
    if (depth > 10 || value === null || typeof value !== 'object') return false;
    if (Array.isArray(value)) return value.some((item) => hasOperatorKey(item, depth + 1));
    return Object.keys(value).some(
        (key) => key.startsWith('$') || key.includes('.') || hasOperatorKey(value[key], depth + 1)
    );
};

const rejectOperatorKeys = (req, res, next) => {
    if (hasOperatorKey(req.body) || hasOperatorKey(req.query) || hasOperatorKey(req.params)) {
        return res.status(400).json({ message: 'Invalid request.' });
    }
    next();
};

const limiter = (options) =>
    rateLimit({
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: { message: 'Too many requests. Please wait a few minutes and try again.' },
        ...options,
    });

const emailKey = (req) =>
    `${ipKeyGenerator(req.ip)}|${typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''}`;

// Limits are per process. Behind a load balancer with several instances,
// move to a shared store (e.g. Redis) before relying on exact numbers.
// A factory, so every app instance (and every test) gets fresh counters.
const createLimiters = () => ({
    general: limiter({ windowMs: 15 * 60 * 1000, limit: 300 }),
    login: limiter({ windowMs: 15 * 60 * 1000, limit: 5, keyGenerator: emailKey, skipSuccessfulRequests: true }),
    register: limiter({ windowMs: 60 * 60 * 1000, limit: 5 }),
    otp: limiter({ windowMs: 15 * 60 * 1000, limit: 10 }),
    passwordReset: limiter({ windowMs: 60 * 60 * 1000, limit: 5 }),
    oauth: limiter({ windowMs: 15 * 60 * 1000, limit: 20 }),
    ai: limiter({
        windowMs: 60 * 60 * 1000,
        limit: 30,
        keyGenerator: (req) => (req.user ? `user:${req.user.id}` : ipKeyGenerator(req.ip)),
    }),
    upload: limiter({
        windowMs: 60 * 60 * 1000,
        limit: 10,
        keyGenerator: (req) => (req.user ? `user:${req.user.id}` : ipKeyGenerator(req.ip)),
    }),
});

module.exports = { rejectOperatorKeys, hasOperatorKey, createLimiters };
