const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { getConfig } = require('../config/env');
const { generateToken, publicUser } = require('../utils/token');
const {
    isNonEmptyString,
    normalizeEmail,
    isValidEmail,
    isValidPassword,
    emailLookup,
} = require('../utils/validation');

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TTL_MS = 15 * 60 * 1000;
const OAUTH_CODE_TTL_MS = 60 * 1000;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const safeEqual = (a, b) => {
    const left = Buffer.from(String(a));
    const right = Buffer.from(String(b));
    return left.length === right.length && crypto.timingSafeEqual(left, right);
};

// OTPs are stored hashed. Records created before this change hold a plain
// 6-digit OTP, which is still accepted until it expires.
const otpMatches = (stored, provided) => {
    if (!stored) return false;
    if (stored.length === 64) return safeEqual(stored, sha256(provided));
    return safeEqual(stored, provided);
};

const issueOtp = async (user) => {
    const otp = generateOtp();
    user.otp = sha256(otp);
    user.otpExpiry = new Date(Date.now() + OTP_TTL_MS);
    user.otpAttempts = 0;
    await user.save();
    return emailService.sendEmail({
        to: user.email,
        subject: 'Your Veda Scholars verification code',
        text: `Your verification code is ${otp}. It expires in 5 minutes.\n\nIf you did not request this, you can ignore this email.`,
    });
};

const REGISTER_RESPONSE = {
    message: 'If this email can be registered, a verification code has been sent to it.',
};

// @desc    Register new user (always as a student)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!isNonEmptyString(name, 100) || !isValidEmail(normalizeEmail(email)) || !isValidPassword(password)) {
            return res.status(400).json({
                message: 'Please provide your name, a valid email and a password of at least 8 characters.',
            });
        }

        const existing = await User.findOne(emailLookup(email));
        if (existing) {
            // Same response either way so the endpoint cannot be used to
            // discover registered emails. Unverified accounts get a fresh code;
            // their password is left unchanged.
            if (!existing.isVerified) await issueOtp(existing);
            return res.status(201).json(REGISTER_RESPONSE);
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Role is never taken from the request: privileged roles (admin,
        // recruiter, university) can only be granted by an administrator.
        const user = await User.create({
            name: name.trim(),
            email: normalizeEmail(email),
            password: hashedPassword,
            role: 'student',
        });

        const emailSent = await issueOtp(user);
        if (!emailSent) {
            console.warn('Registration OTP email could not be sent. Check email configuration.');
        }

        res.status(201).json(REGISTER_RESPONSE);
    } catch (error) {
        console.error('registerUser error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const invalid = () =>
        res.status(400).json({ message: 'The verification code is invalid or has expired. Request a new code.' });

    try {
        const { email, otp } = req.body;

        if (!isValidEmail(normalizeEmail(email)) || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'Please provide your email and the 6-digit code.' });
        }

        const user = await User.findOne(emailLookup(email));
        if (!user || user.isVerified || !user.otp || !user.otpExpiry) return invalid();

        if (new Date() > user.otpExpiry) return invalid();

        if (!otpMatches(user.otp, otp)) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
                user.otp = undefined;
                user.otpExpiry = undefined;
                user.otpAttempts = 0;
            }
            await user.save();
            return invalid();
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error('verifyOTP error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(normalizeEmail(email)) || typeof password !== 'string' || password.length > 128) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne(emailLookup(email));

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            return res.status(200).json({
                ...publicUser(user),
                token: generateToken(user),
            });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('loginUser error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

const FORGOT_RESPONSE = {
    message: 'If an account exists for this email, a password reset link has been sent.',
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!isValidEmail(normalizeEmail(email))) {
            return res.status(400).json({ message: 'Please provide a valid email.' });
        }

        const user = await User.findOne(emailLookup(email));
        if (!user) return res.status(200).json(FORGOT_RESPONSE);

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = sha256(resetToken);
        user.resetTokenExpiry = Date.now() + RESET_TTL_MS;
        await user.save();

        const resetUrl = `${getConfig().clientUrl}/reset-password/${resetToken}`;
        const sent = await emailService.sendEmail({
            to: user.email,
            subject: 'Veda Scholars password reset',
            text: `Use this link to reset your password:\n\n${resetUrl}\n\nThe link expires in 15 minutes. If you did not request a reset, you can ignore this email.`,
        });

        if (!sent) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();
            console.warn('Password reset email could not be sent. Check email configuration.');
        }

        res.status(200).json(FORGOT_RESPONSE);
    } catch (error) {
        console.error('forgotPassword error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (typeof token !== 'string' || !/^[a-f\d]{64}$/i.test(token)) {
            return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });
        }

        const user = await User.findOne({
            resetToken: sha256(token),
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
        }

        user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        // Signs out every existing session for this account.
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        res.status(200).json({ message: 'Your password has been reset. You can now log in.' });
    } catch (error) {
        console.error('resetPassword error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Called after Google sign-in: stores a short-lived, single-use code and
// returns it. The browser exchanges it for a token via POST, so the JWT never
// appears in a URL, browser history or server logs.
const createOAuthCode = async (user) => {
    const code = crypto.randomBytes(32).toString('hex');
    user.oauthCodeHash = sha256(code);
    user.oauthCodeExpiry = new Date(Date.now() + OAUTH_CODE_TTL_MS);
    await user.save();
    return code;
};

// @desc    Exchange a one-time Google sign-in code for a token
// @route   POST /api/auth/oauth/exchange
// @access  Public
const exchangeOAuthCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (typeof code !== 'string' || !/^[a-f\d]{64}$/i.test(code)) {
            return res.status(400).json({ message: 'Invalid sign-in code.' });
        }

        // Atomically consume the code so it can only be used once.
        const user = await User.findOneAndUpdate(
            { oauthCodeHash: sha256(code), oauthCodeExpiry: { $gt: new Date() } },
            { $unset: { oauthCodeHash: 1, oauthCodeExpiry: 1 } },
            { returnDocument: 'after' }
        );

        if (!user) {
            return res.status(400).json({ message: 'This sign-in link has expired. Please sign in again.' });
        }

        res.status(200).json({ ...publicUser(user), token: generateToken(user) });
    } catch (error) {
        console.error('exchangeOAuthCode error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
    createOAuthCode,
    exchangeOAuthCode,
};
