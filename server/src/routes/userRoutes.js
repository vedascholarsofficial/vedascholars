const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getResumeData, saveResumeData, getResumeScore, uploadResume } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/resume/upload', protect, upload.single('resume'), uploadResume);
router.get('/resume/score', protect, getResumeScore);
router.get('/resume', protect, getResumeData);
router.post('/resume', protect, saveResumeData);

module.exports = router;
