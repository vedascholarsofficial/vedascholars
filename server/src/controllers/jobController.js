const Job = require('../models/Job');
const Application = require('../models/Application');
const { createNotification } = require('./notificationController');

// @desc    Create a new job
// @route   POST /api/jobs/create
// @access  Protected (Recruiter only)
const createJob = async (req, res) => {
    try {
        const { title, company, location, type, description, requirements, salary } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            type,
            description,
            requirements,
            salary,
            status: 'pending',
            postedBy: req.user.id,
        });

        // Notify the recruiter their job is pending review
        await createNotification(req.user.id, `Your job "${title}" has been submitted and is pending admin approval.`, 'job');

        res.status(201).json(job);
    } catch (error) {
        console.error("createJob Error: ", error);
        res.status(500).json({ message: 'Server error creating job.' });
    }
};

// @desc    Get all active/approved jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'approved' }).sort({ createdAt: -1 }).populate('postedBy', 'name email');
        res.status(200).json(jobs);
    } catch (error) {
        console.error("getAllJobs Error:", error);
        res.status(500).json({ message: 'Server error fetching jobs.' });
    }
};

// @desc    Get ALL jobs unconditionally (Admin only)
// @route   GET /api/jobs/admin/all
// @access  Protected (Admin only)
const getAdminJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'name email');
        res.status(200).json(jobs);
    } catch (error) {
        console.error("getAdminJobs Error:", error);
        res.status(500).json({ message: 'Server error fetching admin jobs master route.' });
    }
};

// @desc    Get recruiter explicitly authored jobs
// @route   GET /api/jobs/recruiter
// @access  Protected (Recruiter only)
const getRecruiterJobs = async (req, res) => {
    try {
         const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 }).lean();
         
         // Aggregate applicant counts dynamically
         const expandedJobs = await Promise.all(
              jobs.map(async (job) => {
                  const applicantCount = await Application.countDocuments({ job: job._id });
                  return { ...job, applicantCount };
              })
         );
         res.status(200).json(expandedJobs);
    } catch (error) {
         console.error("getRecruiterJobs Error:", error);
         res.status(500).json({ message: 'Server error fetching your jobs.' });
    }
};

// @desc    Admin Approve a pending job
// @route   PUT /api/jobs/:id/approve
// @access  Protected (Admin only)
const approveJob = async (req, res) => {
    try {
         const job = await Job.findByIdAndUpdate(req.params.id, { status: 'approved' }, { returnDocument: 'after' });
         if (!job) return res.status(404).json({ message: 'Job not found' });
         // Notify the recruiter their job was approved
         await createNotification(job.postedBy, `Your job "${job.title}" has been approved and is now live on the platform.`, 'job');
         res.status(200).json(job);
    } catch (error) {
         console.error("approveJob Error:", error);
         res.status(500).json({ message: 'Server error approving job.' });
    }
};

// @desc    Admin Reject a pending job
// @route   PUT /api/jobs/:id/reject
// @access  Protected (Admin only)
const rejectJob = async (req, res) => {
    try {
         const job = await Job.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { returnDocument: 'after' });
         if (!job) return res.status(404).json({ message: 'Job not found' });
         // Notify the recruiter their job was rejected
         await createNotification(job.postedBy, `Your job "${job.title}" was not approved at this time. Please review and resubmit.`, 'job');
         res.status(200).json(job);
    } catch (error) {
         console.error("rejectJob Error:", error);
         res.status(500).json({ message: 'Server error rejecting job.' });
    }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error("getJobById Error:", error);
        res.status(500).json({ message: 'Server error fetching job details.' });
    }
};

// @desc    Apply to a specific job
// @route   POST /api/jobs/apply/:jobId
// @access  Protected
const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
             return res.status(400).json({ message: 'Job ID is required.' });
        }

        const jobExists = await Job.findById(jobId);
        if (!jobExists) {
             return res.status(404).json({ message: 'Job not found.' });
        }
        
        if (jobExists.status !== 'approved') {
             return res.status(400).json({ message: 'Cannot apply to a role that is not currently approved.'});
        }

        const alreadyApplied = await Application.findOne({
             job: jobId,
             user: req.user.id
        });

        if (alreadyApplied) {
             return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        const application = await Application.create({
             user: req.user.id,
             job: jobId,
        });

        // Notify the recruiter that someone applied to their job
        await createNotification(
            jobExists.postedBy,
            `A new candidate applied for your job "${jobExists.title}".`,
            'application'
        );
        // Notify the student their application was submitted
        await createNotification(
            req.user.id,
            `You have successfully applied for "${jobExists.title}" at ${jobExists.company}.`,
            'application'
        );

        res.status(201).json(application);
    } catch (error) {
        console.error("applyToJob Error: ", error);
        res.status(500).json({ message: 'Server error while applying to job.' });
    }
};
// @desc    Delete job permanently (Admin only)
// @route   DELETE /api/jobs/:id
// @access  Protected (Admin only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        res.status(200).json({ message: `Job "${job.title}" successfully deleted.` });
    } catch (error) {
        console.error('deleteJob Error:', error);
        res.status(500).json({ message: 'Server error deleting job posting.' });
    }
};

// @desc    Update an existing job
// @route   PUT /api/jobs/:id
// @access  Protected (Admin / Recruiter)
const updateJob = async (req, res) => {
    try {
        const { title, company, location, type, description, requirements, salary, status } = req.body;
        
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        // If recruiter is updating, they can only update their own job
        if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this job.' });
        }

        // Build update object
        const updateData = { title, company, location, type, description, requirements, salary };
        // Admin gets absolute override privileges on status edits from the manual form
        if (req.user.role === 'admin' && status) updateData.status = status;

        job = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json(job);
    } catch (error) {
        console.error('updateJob Error:', error);
        res.status(500).json({ message: 'Server error updating job details.' });
    }
};
module.exports = {
    createJob,
    getAllJobs,
    getAdminJobs,
    getRecruiterJobs,
    approveJob,
    rejectJob,
    getJobById,
    applyToJob,
    deleteJob,
    updateJob
};
