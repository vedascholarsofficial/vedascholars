const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Native JWT token generator for Google Proxy Context
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// --- Google OAuth 2.0 Webhooks ---
router.get('/google', (req, res, next) => {
    const role = req.query.role || 'student';
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: role
    })(req, res, next);
});

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login?auth=failed' }), (req, res) => {
    const token = generateToken(req.user._id);
    const safeData = encodeURIComponent(JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    }));
    res.redirect(`http://localhost:3000/auth/callback?token=${token}&user=${safeData}`);
});
// ---------------------------------

module.exports = router;
