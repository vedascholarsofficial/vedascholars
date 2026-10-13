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
    // ---- SECURITY FIELDS (additive; defaults apply to existing records) ----
    // Incremented on password reset / role change to invalidate issued tokens.
    tokenVersion: {
        type: Number,
        default: 0,
    },
    // Failed OTP attempts for the current OTP; the OTP is discarded at the limit.
    otpAttempts: {
        type: Number,
        default: 0,
    },
    // One-time code exchanged for a token after Google sign-in (sha256 hash).
    oauthCodeHash: {
        type: String,
    },
    oauthCodeExpiry: {
        type: Date,
    },
    // Student consent to share a minimal profile (name, skills) with partner
    // universities. Defaults to false: nothing is shared without opt-in.
    shareProfileWithUniversities: {
        type: Boolean,
        default: false,
    },
    shareProfileConsentAt: {
        type: Date,
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

// Never serialise credentials or verification secrets, whichever route
// returns a user document.
const SENSITIVE_FIELDS = [
    'password',
    'otp',
    'otpExpiry',
    'otpAttempts',
    'resetToken',
    'resetTokenExpiry',
    'oauthCodeHash',
    'oauthCodeExpiry',
    'tokenVersion',
    'googleId',
    '__v',
];

const stripSensitive = (doc, ret) => {
    for (const field of SENSITIVE_FIELDS) delete ret[field];
    return ret;
};

userSchema.set('toJSON', { transform: stripSensitive });
userSchema.set('toObject', { transform: stripSensitive });

module.exports = mongoose.model('User', userSchema);
module.exports.SENSITIVE_FIELDS = SENSITIVE_FIELDS;
