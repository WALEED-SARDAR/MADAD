const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { upload, errorHandler } = require('../middlewares/upload');
const {getUserProfile, updateProfile, updatePassword} = require('../controllers/userController');

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update name, email, and avatar
router.put('/profile', protect, upload.single('avatar'), errorHandler, updateProfile);

// Update password
router.put('/password', protect, updatePassword);

module.exports = router;
