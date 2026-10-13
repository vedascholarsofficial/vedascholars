const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env');

// Tokens carry the user's tokenVersion so a password reset (or an admin role
// change) invalidates every previously issued token.
const generateToken = (user) => {
    const { jwtSecret, jwtExpiresIn } = getConfig();
    return jwt.sign({ id: String(user._id), tv: user.tokenVersion || 0 }, jwtSecret, {
        algorithm: 'HS256',
        expiresIn: jwtExpiresIn,
    });
};

const verifyToken = (token) =>
    jwt.verify(token, getConfig().jwtSecret, { algorithms: ['HS256'] });

// The only user fields ever returned to the client after authentication.
const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

module.exports = { generateToken, verifyToken, publicUser };
