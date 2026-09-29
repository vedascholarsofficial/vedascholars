const User = require('../models/User');
const { calculateResumeScore } = require('../services/resumeScoringService');
const { parseResume } = require('../services/resumeParserService');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("getUserProfile Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.education = req.body.education !== undefined ? req.body.education : user.education;
            user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
            user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
            user.resume = req.body.resume !== undefined ? req.body.resume : user.resume;

            // Compute Profile Completion (Needs phone, skills, and either education or experience)
            const hasPhone = !!user.phone;
            const hasSkills = user.skills && user.skills.length > 0;
            const hasEduOrExp = (user.education && user.education.length > 0) || (user.experience && user.experience.length > 0);

            user.profileCompleted = !!(hasPhone && hasSkills && hasEduOrExp);

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                education: updatedUser.education,
                skills: updatedUser.skills,
                experience: updatedUser.experience,
                resume: updatedUser.resume,
                profileCompleted: updatedUser.profileCompleted,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("updateUserProfile Error:", error);
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
        console.error("getResumeData Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upsert user's deep resume data specifically marking profile complete
// @route   POST /api/user/resume
// @access  Private
const saveResumeData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
             user.resumeData = req.body.resumeData || user.resumeData;
             user.profileCompleted = true; // Business requirement trigger
             
             await user.save();
             res.status(200).json({ 
                  message: 'Resume updated successfully',
                  resumeData: user.resumeData,
                  profileCompleted: true
             });
        } else {
             res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("saveResumeData Error:", error);
        res.status(500).json({ message: 'Failed to process resume tree telemetry' });
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
        console.error("getResumeScore Error:", error);
        res.status(500).json({ message: 'Server Error calculating resume points' });
    }
};

// @desc    Upload and parse PDF resume natively
// @route   POST /api/user/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
             return res.status(400).json({ message: 'Please attach a valid PDF document.' });
        }
        
        // Extract plain text blocks from the locally stored Multer PDF interceptor
        const extractedText = await parseResume(req.file.path);

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { resumeRawText: extractedText },
            { returnDocument: 'after' }
        );

        res.status(200).json({ 
            message: 'Resume parsed and algorithm cached successfully.',
            rawText: extractedText 
        });
    } catch (error) {
        console.error("uploadResume Engine Error:", error);
        res.status(500).json({ message: 'Backend engine failed to natively parse the targeted PDF. Details: ' + error.message });
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
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('getAllUsers Error:', error);
        res.status(500).json({ message: 'Server error retrieving system users.' });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Protected/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        // Basic validation
        if (!['student', 'recruiter', 'university', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role assignment.' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { returnDocument: 'after', select: '-password' }
        );

        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json(user);
    } catch (error) {
        console.error('updateUserRole Error:', error);
        res.status(500).json({ message: 'Server error updating user role.' });
    }
};

// @desc    Delete a user completely (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Protected/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Optional: Could clean up associated jobs or applications here in the future
        // e.g. await Job.deleteMany({ postedBy: req.params.id })
        
        res.status(200).json({ message: `User "${user.name}" permanently deleted.` });
    } catch (error) {
        console.error('deleteUser Error:', error);
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
