const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getAdminJobs, getRecruiterJobs, approveJob, rejectJob, getJobById, applyToJob, deleteJob, updateJob } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/create', protect, allowRoles('recruiter', 'admin'), createJob);
router.get('/recruiter', protect, allowRoles('recruiter', 'admin'), getRecruiterJobs);
router.put('/:id/approve', protect, allowRoles('admin'), approveJob);
router.put('/:id/reject', protect, allowRoles('admin'), rejectJob);

router.get('/', getAllJobs);
router.get('/admin/all', protect, allowRoles('admin'), getAdminJobs);
router.get('/:id', getJobById);
router.post('/apply/:jobId', protect, applyToJob);
router.put('/:id', protect, allowRoles('admin', 'recruiter'), updateJob);
router.delete('/:id', protect, allowRoles('admin'), deleteJob);

module.exports = router;
