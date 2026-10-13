const Job = require('../models/Job');
const Application = require('../models/Application');
const { createNotification } = require('./notificationController');
const { isNonEmptyString, isObjectId, toStringArray } = require('../utils/validation');

const JOB_STATUSES = ['pending', 'approved', 'rejected'];

// Validates recruiter/admin job input. Returns null when invalid.
const parseJobInput = (body, { partial = false } = {}) => {
    const data = {};
    const textFields = { title: 200, company: 200, location: 200, type: 50, description: 10000, salary: 100 };
    for (const [field, max] of Object.entries(textFields)) {
        const isNameField = field === 'title' || field === 'company';
        if (body[field] === undefined) {
            if (isNameField && !partial) return null;
            continue;
        }
        const valid = isNameField
            ? isNonEmptyString(body[field], max)
            : typeof body[field] === 'string' && body[field].length <= max;
        if (!valid) return null;
        data[field] = body[field];
    }
    if (body.requirements !== undefined) {
        const requirements = toStringArray(body.requirements, { maxItems: 50, maxLength: 500 });
        if (requirements === null) return null;
        data.requirements = requirements;
    }
    return data;
};

// @desc    Create a new job
// @route   POST /api/jobs/create
// @access  Protected (Recruiter only)
const createJob = async (req, res) => {
    try {
        const data = parseJobInput(req.body);
        if (!data) return res.status(400).json({ message: 'A job title, company and valid details are required.' });

        const job = await Job.create({
            ...data,
            status: 'pending',
            postedBy: req.user.id,
        });

        // Notify the recruiter their job is pending review
        await createNotification(req.user.id, `Your job "${data.title}" has been submitted and is pending admin approval.`, 'job');

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
        const jobs = await Job.find({ status: 'approved' }).sort({ createdAt: -1 }).populate('postedBy', 'name');
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
         
         // One aggregate for all applicant counts instead of a query per job.
         const counts = await Application.aggregate([
              { $match: { job: { $in: jobs.map((job) => job._id) } } },
              { $group: { _id: '$job', count: { $sum: 1 } } },
         ]);
         const countByJob = new Map(counts.map((c) => [String(c._id), c.count]));
         const expandedJobs = jobs.map((job) => ({ ...job, applicantCount: countByJob.get(String(job._id)) || 0 }));
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
         if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Job not found' });
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
         if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Job not found' });
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
// @access  Public for approved jobs; pending/rejected jobs only for their
//          recruiter or an admin
const getJobById = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Job not found' });
        const job = await Job.findById(req.params.id).populate('postedBy', 'name');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const isOwner = req.user && job.postedBy && String(job.postedBy._id) === String(req.user._id);
        const isAdmin = req.user && req.user.role === 'admin';
        if (job.status !== 'approved' && !isOwner && !isAdmin) {
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

        if (req.user.role !== 'student') {
             return res.status(403).json({ message: 'Only students can apply to jobs.' });
        }
        if (!isObjectId(jobId)) {
             return res.status(404).json({ message: 'Job not found.' });
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
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
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
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Job not found.' });
        const data = parseJobInput(req.body, { partial: true });
        if (!data) return res.status(400).json({ message: 'Invalid job details.' });
        const { status } = req.body;

        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });

        // If recruiter is updating, they can only update their own job
        if (req.user.role === 'recruiter' && job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this job.' });
        }

        const updateData = { ...data };
        if (req.user.role === 'admin') {
            // Admin may set status explicitly from the manual form.
            if (status !== undefined) {
                if (!JOB_STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid job status.' });
                updateData.status = status;
            }
        } else if (Object.keys(data).length > 0) {
            // Recruiter edits go back through admin review before going live again.
            updateData.status = 'pending';
        }

        job = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,
            { returnDocument: 'after', runValidators: true }
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
