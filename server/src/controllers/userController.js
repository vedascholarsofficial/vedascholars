const fs = require('fs/promises');
const User = require('../models/User');
const { calculateResumeScore } = require('../services/resumeScoringService');
const { parseResume } = require('../services/resumeParserService');
const { isNonEmptyString, isObjectId, toStringArray, toObjectArray } = require('../utils/validation');

const ROLES = ['student', 'recruiter', 'university', 'admin'];

// Fields an admin may see in the user list. Credentials, OTPs, reset tokens
// and résumé contents are never included.
const ADMIN_USER_FIELDS = 'name email role isVerified profileCompleted createdAt';

const profileResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    education: user.education,
    skills: user.skills,
    experience: user.experience,
    resume: user.resume,
    profileCompleted: user.profileCompleted,
    shareProfileWithUniversities: user.shareProfileWithUniversities,
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('getUserProfile Error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, phone, education, skills, experience, resume, shareProfileWithUniversities } = req.body;
        const invalid = () => res.status(400).json({ message: 'Some profile fields are invalid.' });

        if (name !== undefined) {
            if (!isNonEmptyString(name, 100)) return invalid();
            user.name = name.trim();
        }
        if (phone !== undefined) {
            if (typeof phone !== 'string' || phone.length > 30) return invalid();
            user.phone = phone.trim();
        }
        if (education !== undefined) {
            const list = toObjectArray(education, ['degree', 'institution', 'year'], { maxLength: 200 });
            if (list === null) return invalid();
            user.education = list;
        }
        if (skills !== undefined) {
            const list = toStringArray(skills);
            if (list === null) return invalid();
            user.skills = list;
        }
        if (experience !== undefined) {
            const list = toObjectArray(experience, ['company', 'role', 'duration'], { maxLength: 200 });
            if (list === null) return invalid();
            user.experience = list;
        }
        if (resume !== undefined) {
            if (typeof resume !== 'string' || resume.length > 2000) return invalid();
            user.resume = resume;
        }
        if (shareProfileWithUniversities !== undefined) {
            if (typeof shareProfileWithUniversities !== 'boolean') return invalid();
            if (shareProfileWithUniversities !== user.shareProfileWithUniversities) {
                user.shareProfileWithUniversities = shareProfileWithUniversities;
                user.shareProfileConsentAt = new Date();
            }
        }

        // Profile is complete with phone, skills, and either education or experience.
        const hasPhone = !!user.phone;
        const hasSkills = user.skills && user.skills.length > 0;
        const hasEduOrExp = (user.education && user.education.length > 0) || (user.experience && user.experience.length > 0);
        user.profileCompleted = !!(hasPhone && hasSkills && hasEduOrExp);

        const updatedUser = await user.save();
        res.status(200).json(profileResponse(updatedUser));
    } catch (error) {
        console.error('updateUserProfile Error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's detailed resume data
// @route   GET /api/user/resume
// @access  Private
const getResumeData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('resumeData');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.resumeData || {});
    } catch (error) {
        console.error('getResumeData Error:', error.name);
        res.status(500).json({ message: 'Server Error' });
    }
};

const sanitizeResumeData = (data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
    const clean = {};
    if (data.summary !== undefined) {
        if (typeof data.summary !== 'string' || data.summary.length > 5000) return null;
        clean.summary = data.summary;
    }
    const lists = {
        education: () => toObjectArray(data.education, ['degree', 'institution', 'year'], { maxLength: 200 }),
        skills: () => toStringArray(data.skills),
        experience: () => toObjectArray(data.experience, ['company', 'role', 'duration', 'description']),
        projects: () => toObjectArray(data.projects, ['title', 'description', 'techStack']),
    };
    for (const [key, parse] of Object.entries(lists)) {
        if (data[key] === undefined) continue;
        const value = parse();
        if (value === null) return null;
        clean[key] = value;
    }
    return clean;
};

// @desc    Upsert user's deep resume data specifically marking profile complete
// @route   POST /api/user/resume
// @access  Private
const saveResumeData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.resumeData !== undefined) {
            const resumeData = sanitizeResumeData(req.body.resumeData);
            if (resumeData === null) {
                return res.status(400).json({ message: 'Some résumé fields are invalid.' });
            }
            user.resumeData = resumeData;
        }
        user.profileCompleted = true; // Business requirement trigger

        await user.save();
        res.status(200).json({
            message: 'Resume updated successfully',
            resumeData: user.resumeData,
            profileCompleted: true
        });
    } catch (error) {
        console.error('saveResumeData Error:', error.name);
        res.status(500).json({ message: 'Failed to save résumé.' });
    }
};

// @desc    Calculate AI score for User Resume
// @route   GET /api/user/resume/score
// @access  Private
const getResumeScore = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('resumeData profileCompleted');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // UX Logic Rule: If not completed / no resume
        if (!user.profileCompleted && (!user.resumeData || Object.keys(user.resumeData).length === 0)) {
            return res.status(200).json({
                score: 0,
                suggestions: ["Build your resume to get score"]
            });
        }

        const scoreData = calculateResumeScore(user.resumeData);
        res.status(200).json(scoreData);
    } catch (error) {
        console.error('getResumeScore Error:', error.name);
        res.status(500).json({ message: 'Server Error calculating resume points' });
    }
};

const PDF_MAGIC = Buffer.from('%PDF-');

const isPdfFile = async (filePath) => {
    const handle = await fs.open(filePath, 'r');
    try {
        const buffer = Buffer.alloc(PDF_MAGIC.length);
        await handle.read(buffer, 0, PDF_MAGIC.length, 0);
        return buffer.equals(PDF_MAGIC);
    } finally {
        await handle.close();
    }
};

// @desc    Upload and parse PDF resume natively
// @route   POST /api/user/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please attach a valid PDF document.' });
    }
    try {
        if (!(await isPdfFile(req.file.path))) {
            return res.status(400).json({ message: 'The uploaded file is not a valid PDF.' });
        }

        const extractedText = await parseResume(req.file.path);
        await User.findByIdAndUpdate(req.user.id, { resumeRawText: extractedText });

        res.status(200).json({
            message: 'Resume parsed and algorithm cached successfully.',
            rawText: extractedText
        });
    } catch (error) {
        console.error('uploadResume Error:', error.name);
        res.status(500).json({ message: 'We could not read this PDF. Please try another file.' });
    } finally {
        // The original file is not needed once the text has been extracted.
        await fs.unlink(req.file.path).catch(() => {});
    }
};

// ==========================================
// ADMIN CONTROL PANEL OPERATIONS
// ==========================================

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Protected/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(ADMIN_USER_FIELDS).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('getAllUsers Error:', error.name);
        res.status(500).json({ message: 'Server error retrieving system users.' });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Protected/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'User not found.' });
        if (!ROLES.includes(role)) {
            return res.status(400).json({ message: 'Invalid role assignment.' });
        }
        if (String(req.user._id) === req.params.id) {
            return res.status(400).json({ message: 'You cannot change your own role.' });
        }

        // A role change signs the user out so the new permissions apply at once.
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, $inc: { tokenVersion: 1 } },
            { returnDocument: 'after', projection: ADMIN_USER_FIELDS }
        );

        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(user);
    } catch (error) {
        console.error('updateUserRole Error:', error.name);
        res.status(500).json({ message: 'Server error updating user role.' });
    }
};

// @desc    Delete a user completely (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Protected/Admin
const deleteUser = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'User not found.' });
        if (String(req.user._id) === req.params.id) {
            return res.status(400).json({ message: 'You cannot delete your own account here.' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: `User "${user.name}" permanently deleted.` });
    } catch (error) {
        console.error('deleteUser Error:', error.name);
        res.status(500).json({ message: 'Server error terminating user.' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getResumeData,
    saveResumeData,
    getResumeScore,
    uploadResume,
    getAllUsers,
    updateUserRole,
    deleteUser
};
