const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'university', 'admin'],
        default: 'student',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    googleId: {
        type: String,
    },
    // ---- PROFILE EXTENSION FIELDS ----
    phone: {
        type: String,
    },
    education: [
        {
            degree: String,
            institution: String,
            year: String
        }
    ],
    skills: [String],
    experience: [
        {
            company: String,
            role: String,
            duration: String
        }
    ],
    resumeData: {
        summary: String,
        education: [
            {
                degree: String,
                institution: String,
                year: String
            }
        ],
        skills: [String],
        experience: [
            {
                company: String,
                role: String,
                duration: String,
                description: String
            }
        ],
        projects: [
            {
                title: String,
                description: String,
                techStack: [String]
            }
        ]
    },
    resumeRawText: {
        type: String, // Specifically maps extracted pdf-parse strings
    },
    resume: {
        type: String, // URL or encoded text
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    // ----------------------------------
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);
