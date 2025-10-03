const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({
            success: true,
            user:user.avatar.url,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        });
    }
};

// Update name, email, and avatar
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updateData = {};

        // Handle name and email updates
        if (name) updateData.name = name;
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            updateData.email = email;
        }

        // Handle avatar upload
        if (req.file) {
            // Delete old avatar if exists
            if (req.user.avatar.public_id) {
                await cloudinary.uploader.destroy(req.user.avatar.public_id);
            }

            // Convert image to base64
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

            // Upload new avatar
            const uploadedImage = await cloudinary.uploader.upload(dataURI, {
                folder: "avatars",
                transformation: [{ width: 200, height: 200, crop: "fill" }]
            });

            updateData.avatar = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            };
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// Update password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const isPasswordValid = await req.user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        await User.findByIdAndUpdate(req.user._id, {
            password: newPassword
        });

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
};

module.exports = {
    getUserProfile,
    updateProfile,
    updatePassword
};
