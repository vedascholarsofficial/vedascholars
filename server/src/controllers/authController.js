const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            otp,
            otpExpiry,
        });

        if (user) {
            // Send OTP via email
            const emailSent = await sendEmail({
                to: user.email,
                subject: 'Your Registration OTP',
                text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
            });

            if (!emailSent) {
                console.warn("Failed to send email OTP. Proceeding anyway but check SMTP settings.");
            }

            res.status(201).json({
                message: 'User registered successfully. Please check your email for the OTP.',
                userId: user._id, 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and OTP' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No registered user matches this address' });
        }

        // Generate unhashed reset token for email payload
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token natively inside database for protection against leaks
        user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // Exact 15 minutes limit
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const message = `Please explicitly navigate to this URL to reset your password:\n\n${resetUrl}\n\nNote: This link physically expires in exactly 15 minutes.`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Veda Scholars - Secure Password Reset Directive',
                text: message,
            });

            res.status(200).json({ message: 'Secure recovery payload transmitted successfully.' });
        } catch (error) {
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;
            await user.save();
            return res.status(500).json({ message: 'Internal server error preventing SMTP transmission' });
        }
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Server Configuration Error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Re-hash parameter to confirm exact match without exposing raw database logs
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'URL token is completely rejected or chronologically expired.' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password syntax invalid.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Identity credentials successfully synchronized.' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server Integrity Operation Failed' });
    }
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword
};
