const express = require('express');
const router = express.Router();
const { applyToJob, getUserApplications } = require('../controllers/applicationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, applyToJob)
    .get(protect, getUserApplications);

module.exports = router;
