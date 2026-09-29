const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');

router.get('/analytics', protect, allowRoles('admin'), getAdminStats);

// User Management Routes (Admin Only)
router.get('/users', protect, allowRoles('admin'), getAllUsers);
router.put('/users/:id', protect, allowRoles('admin'), updateUserRole);
router.delete('/users/:id', protect, allowRoles('admin'), deleteUser);

module.exports = router;
