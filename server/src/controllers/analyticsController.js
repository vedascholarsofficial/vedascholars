const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get aggregated admin analytics stats
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
    try {
        // --- Basic Counts ---
        const [totalUsers, totalJobs, totalApplications] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
        ]);

        // --- Jobs per Recruiter ---
        const jobsPerRecruiter = await Job.aggregate([
            {
                $group: {
                    _id: '$postedBy',
                    jobCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'recruiter'
                }
            },
            { $unwind: { path: '$recruiter', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    recruiterId: '$_id',
                    recruiterName: { $ifNull: ['$recruiter.name', 'Unknown'] },
                    jobCount: 1
                }
            },
            { $sort: { jobCount: -1 } },
            { $limit: 10 }
        ]);

        // --- Applications per Job ---
        const applicationsPerJob = await Application.aggregate([
            {
                $group: {
                    _id: '$job',
                    applicationCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    jobId: '$_id',
                    jobTitle: { $ifNull: ['$job.title', 'Unknown'] },
                    company: { $ifNull: ['$job.company', ''] },
                    applicationCount: 1
                }
            },
            { $sort: { applicationCount: -1 } },
            { $limit: 10 }
        ]);

        // --- Jobs by Status breakdown ---
        const jobsByStatus = await Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // --- Recent Activity Log ---
        const [recentJobs, recentApps] = await Promise.all([
            Job.find().sort({ createdAt: -1 }).limit(10).populate('postedBy', 'name').lean(),
            Application.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name').populate('job', 'title company').lean()
        ]);

        const recentActivity = [
            ...recentJobs.map(j => ({
                id: j._id,
                type: 'job_posted',
                title: `New job posted: ${j.title}`,
                subtitle: `By ${(j.postedBy && j.postedBy.name) || 'Unknown'} for ${j.company}`,
                date: j.createdAt,
            })),
            ...recentApps.map(a => ({
                id: a._id,
                type: 'application',
                title: `New application for ${a.job ? a.job.title : 'Deleted Job'}`,
                subtitle: `Submitted by ${(a.user && a.user.name) || 'Unknown Candidate'}`,
                date: a.createdAt,
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        res.status(200).json({
            totalUsers,
            totalJobs,
            totalApplications,
            jobsPerRecruiter,
            applicationsPerJob,
            jobsByStatus,
            recentActivity
        });
    } catch (error) {
        console.error('getAdminStats Error:', error);
        res.status(500).json({ message: 'Server error fetching analytics.' });
    }
};

module.exports = { getAdminStats };
