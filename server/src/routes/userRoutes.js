const express = require('express');
const { getUserProfile, updateUserProfile, getResumeData, saveResumeData, getResumeScore, uploadResume } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

module.exports = (limiters) => {
    const router = express.Router();

    router.get('/profile', protect, getUserProfile);
    router.put('/profile', protect, updateUserProfile);

    router.post('/resume/upload', protect, limiters.upload, upload.single('resume'), uploadResume);
    router.get('/resume/score', protect, getResumeScore);
    router.get('/resume', protect, getResumeData);
    router.post('/resume', protect, saveResumeData);

    return router;
};
