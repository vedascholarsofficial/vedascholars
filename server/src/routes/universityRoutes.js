const express = require('express');
const router = express.Router();
const { getAllUniversities, getUniversityById, matchUniversities, createUniversity, updateUniversity, deleteUniversity, getUniversityDashboard } = require('../controllers/universityController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

// NOTE: /match must be declared BEFORE /:id to avoid route collision
router.get('/dashboard', protect, allowRoles('university'), getUniversityDashboard);
router.get('/match', protect, matchUniversities);
router.get('/', getAllUniversities);
router.get('/:id', getUniversityById);

// Admin-only mutations
router.post('/', protect, allowRoles('admin'), createUniversity);
router.put('/:id', protect, allowRoles('admin'), updateUniversity);
router.delete('/:id', protect, allowRoles('admin'), deleteUniversity);

module.exports = router;
