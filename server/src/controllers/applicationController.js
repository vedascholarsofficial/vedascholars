const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a specific job
// @route   POST /api/applications
// @access  Protected (Student only)
const applyToJob = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
             return res.status(403).json({ message: 'Only students can apply to jobs.' });
        }

        const { jobId } = req.body;

        if (!jobId) {
             return res.status(400).json({ message: 'Job ID is required.' });
        }

        // Verify the job actually exists
        const jobExists = await Job.findById(jobId);
        if (!jobExists) {
             return res.status(404).json({ message: 'Job not found.' });
        }

        // Prevent duplicate applications
        const alreadyApplied = await Application.findOne({
             job: jobId,
             user: req.user.id
        });

        if (alreadyApplied) {
             return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        // Create new application map
        const application = await Application.create({
             user: req.user.id,
             job: jobId,
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("Apply to Job Error: ", error);
        res.status(500).json({ message: 'Server error while applying to job.' });
    }
};

// @desc    Get all active applications for the logged in user
// @route   GET /api/applications
// @access  Protected
const getUserApplications = async (req, res) => {
     try {
          const applications = await Application.find({ user: req.user.id })
               .populate('job')
               .sort({ createdAt: -1 });
               
          res.status(200).json(applications);
     } catch (error) {
          console.error("Get User Applications Error: ", error);
          res.status(500).json({ message: 'Server error fetching your applications.' });
     }
};

module.exports = {
    applyToJob,
    getUserApplications
};
