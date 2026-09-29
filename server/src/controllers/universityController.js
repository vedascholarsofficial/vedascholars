const University = require('../models/University');
const User = require('../models/User');

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
const getAllUniversities = async (req, res) => {
    try {
        const universities = await University.find().sort({ createdAt: -1 });
        res.status(200).json(universities);
    } catch (error) {
        console.error('getAllUniversities Error:', error);
        res.status(500).json({ message: 'Server error fetching universities.' });
    }
};

// @desc    Get single university by ID
// @route   GET /api/universities/:id
// @access  Public
const getUniversityById = async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) return res.status(404).json({ message: 'University not found.' });
        res.status(200).json(university);
    } catch (error) {
        console.error('getUniversityById Error:', error);
        res.status(500).json({ message: 'Server error fetching university details.' });
    }
};

// @desc    Match universities to logged-in user's skills
// @route   GET /api/universities/match
// @access  Private
const matchUniversities = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('resumeData skills');

        // Prefer skills from resumeData (resume builder), fallback to top-level profile skills
        const userSkills = (
            user?.resumeData?.skills?.length > 0
                ? user.resumeData.skills
                : user?.skills || []
        ).map(s => s.toLowerCase().trim());

        if (userSkills.length === 0) {
            return res.status(200).json({
                matches: [],
                message: 'No skills found. Please complete your profile or resume builder to get recommendations.'
            });
        }

        const universities = await University.find();

        // Score each university by how many courses match user skills
        const scored = universities.map(uni => {
            let totalMatches = 0;
            let matchedCourses = [];

            uni.courses.forEach(course => {
                const courseSkills = course.skillsRequired.map(s => s.toLowerCase().trim());
                const overlap = userSkills.filter(skill => courseSkills.includes(skill));
                if (overlap.length > 0) {
                    totalMatches += overlap.length;
                    matchedCourses.push({ courseName: course.name, matchedSkills: overlap });
                }
            });

            return {
                _id: uni._id,
                name: uni.name,
                location: uni.location,
                description: uni.description,
                matchScore: totalMatches,
                matchedCourses
            };
        });

        // Filter only actual matches, sort by score descending
        const matches = scored
            .filter(u => u.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);

        res.status(200).json({ matches, userSkills });
    } catch (error) {
        console.error('matchUniversities Error:', error);
        res.status(500).json({ message: 'Server error running university matching algorithm.' });
    }
};

// @desc    Create a new university
// @route   POST /api/universities
// @access  Private (Admin only)
const createUniversity = async (req, res) => {
    try {
        const { name, location, description, courses } = req.body;
        if (!name) return res.status(400).json({ message: 'University name is required.' });

        const university = await University.create({ name, location, description, courses: courses || [] });
        res.status(201).json(university);
    } catch (error) {
        console.error('createUniversity Error:', error);
        res.status(500).json({ message: 'Server error creating university.' });
    }
};

// @desc    Update university by ID
// @route   PUT /api/universities/:id
// @access  Private (Admin only)
const updateUniversity = async (req, res) => {
    try {
        const university = await University.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { returnDocument: 'after', runValidators: true }
        );
        if (!university) return res.status(404).json({ message: 'University not found.' });
        res.status(200).json(university);
    } catch (error) {
        console.error('updateUniversity Error:', error);
        res.status(500).json({ message: 'Server error updating university.' });
    }
};

// @desc    Delete university by ID
// @route   DELETE /api/universities/:id
// @access  Private (Admin only)
const deleteUniversity = async (req, res) => {
    try {
        const university = await University.findByIdAndDelete(req.params.id);
        if (!university) return res.status(404).json({ message: 'University not found.' });
        res.status(200).json({ message: `"${university.name}" has been deleted.` });
    } catch (error) {
        console.error('deleteUniversity Error:', error);
        res.status(500).json({ message: 'Server error deleting university.' });
    }
};

// @desc    Get dashboard metrics for a university (courses + student matches)
// @route   GET /api/universities/dashboard
// @access  Private (University only)
const getUniversityDashboard = async (req, res) => {
    try {
        // Since we don't have user.university explicitly linked yet, return the first one or a mock
        let university = await University.findOne();
        
        if (!university) {
             university = {
                  name: "Veda Demonstration University",
                  courses: [
                      { _id: 'c1', name: "MS in Computer Science", skillsRequired: ["React.js", "Node.js", "Python"], status: 'Active' },
                      { _id: 'c2', name: "MBA Tech Management", skillsRequired: ["Management", "Agile", "Excel"], status: 'Active' }
                  ]
             };
        }

        // Fetch all students with their skills for matching logic
        const students = await User.find({ role: 'student' }).select('name email skills resumeData').lean();
        
        res.status(200).json({
             university,
             students
        });
    } catch (error) {
        console.error('getUniversityDashboard Error:', error);
        res.status(500).json({ message: 'Server error retrieving dashboard aggregates.' });
    }
};

module.exports = { getAllUniversities, getUniversityById, matchUniversities, createUniversity, updateUniversity, deleteUniversity, getUniversityDashboard };

