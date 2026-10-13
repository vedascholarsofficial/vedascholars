const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const readBearerToken = (req) => {
    const header = req.headers.authorization;
    if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
    const token = header.slice(7).trim();
    return token || null;
};

// Resolves the user for a token, or null when the token is invalid, the user
// no longer exists, or the token predates a password reset / role change.
const resolveUser = async (token) => {
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch {
        return null;
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return null;
    if ((decoded.tv || 0) !== (user.tokenVersion || 0)) return null;
    return user;
};

const protect = async (req, res, next) => {
    const token = readBearerToken(req);
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const user = await resolveUser(token);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

// Attaches req.user when a valid token is present; never rejects.
const optionalAuth = async (req, res, next) => {
    const token = readBearerToken(req);
    if (!token) return next();
    try {
        const user = await resolveUser(token);
        if (user) req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { protect, optionalAuth };
