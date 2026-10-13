const express = require('express');
const { passport } = require('../config/passport');
const { getConfig } = require('../config/env');
const {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
    createOAuthCode,
    exchangeOAuthCode,
} = require('../controllers/authController');

module.exports = (limiters) => {
    const router = express.Router();

    // Public sign-up is closed by default (PUBLIC_SIGNUP_ENABLED). Accounts
    // can then only exist if they were created before, or by an administrator.
    const signupOpen = (req, res, next) => {
        if (getConfig().publicSignupEnabled) return next();
        res.status(403).json({ message: 'Online registration is closed. Please contact Veda Scholars.' });
    };

    router.post('/register', limiters.register, signupOpen, registerUser);
    router.post('/verify-otp', limiters.otp, verifyOTP);
    router.post('/login', limiters.login, loginUser);
    router.post('/forgot-password', limiters.passwordReset, forgotPassword);
    router.post('/reset-password/:token', limiters.passwordReset, resetPassword);
    router.post('/oauth/exchange', limiters.otp, exchangeOAuthCode);

    // --- Google OAuth 2.0 ---
    // Any `role` query parameter is ignored: Google accounts are created as
    // students only.
    const googleUnavailable = (req, res) =>
        res.redirect(`${getConfig().clientUrl}/login?auth=unavailable`);

    router.get('/google', limiters.oauth, (req, res, next) => {
        if (!getConfig().googleEnabled) return googleUnavailable(req, res);
        passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
    });

    router.get('/google/callback', limiters.oauth, (req, res, next) => {
        if (!getConfig().googleEnabled) return googleUnavailable(req, res);
        passport.authenticate('google', { session: false }, async (err, user) => {
            const { clientUrl } = getConfig();
            if (err || !user) return res.redirect(`${clientUrl}/login?auth=failed`);
            try {
                const code = await createOAuthCode(user);
                res.redirect(`${clientUrl}/auth/callback?code=${code}`);
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    });

    return router;
};
