const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

//Get All Users
const getAllUsers = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
       const users = await User.find().select("-password");
       res.status(200).json({ success: true, message: "All users fetched successfully", users, count: users.length });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in getting all users", error: error.message });
    }
};

//Get All Campaigns
const getAllCampaigns = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
    const campaigns = await Campaign.find().populate("creator", "name email avatar");
        res.status(200).json({ success: true, message: "All campaigns fetched successfully", campaigns: campaigns.sort((a, b) => b.createdAt - a.createdAt), count: campaigns.length });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in getting all campaigns", error: error.message });
    }
};

//Approve Campaign
const approveCampaign = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, {status: "approved", isActive: true}, {new: true});
        if(!campaign){
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }
        res.status(200).json({ success: true, message: "Campaign approved successfully", campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in approving campaign", error: error.message });
    }
};

//Reject Campaign
const rejectCampaign = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, {status: "rejected", isActive: false}, {new: true});
        if(!campaign){
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }
        res.status(200).json({ success: true, message: "Campaign rejected successfully", campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in rejecting campaign", error: error.message });
    }
};

//Campaign Block/Unblock
const blockUnblockCampaign = async (req, res) => {
    try {
        // Check admin authorization
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }

        // First find the campaign
        const campaign = await Campaign.findById(req.params.id);
        if(!campaign){
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        // Determine new status and isActive state
        const newStatus = campaign.status === "blocked" ? "approved" : "blocked";
        const newIsActive = newStatus === "approved";

        // Update the campaign using findByIdAndUpdate for atomic operation
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: newStatus,
                    isActive: newIsActive,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        ).populate("creator", "name email avatar");

        if (!updatedCampaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: `Campaign ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
            campaign: updatedCampaign
        });
    } catch (error) {
        console.error("Block/Unblock error:", error);
        res.status(500).json({
            success: false,
            message: "Error in blocking/unblocking campaign",
            error: error.message
        });
    }
};

//User Block/Unblock
const blockUnblockUser = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
        const user = await User.findById(req.params.userId);
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const newStatus = user.status === "blocked" ? "active" : "blocked";
        user.status = newStatus;
        await user.save();
        res.status(200).json({ success: true, message: `User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in blocking/unblocking user", error: error.message });
    }
};

//Delete User
const deleteUser = async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({ success: false, message: "You are not authorized to access this route" });
        }
        await User.findByIdAndDelete(req.params.userId);
        await Campaign.deleteMany({ creator: req.params.userId });
        await Donation.deleteMany({ donor: req.params.userId });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in deleting user", error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllCampaigns,
    approveCampaign,
    rejectCampaign,
    blockUnblockCampaign,
    blockUnblockUser,
    deleteUser
};