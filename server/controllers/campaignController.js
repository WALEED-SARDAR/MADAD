const Campaign = require("../models/Campaign");
const cloudinary = require("../config/cloudinary");

const createCampaign = async (req, res) => {
    try {
        const campaignData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            goalAmount: parseFloat(req.body.goalAmount),
            deadline: new Date(req.body.deadline),
            creator: req.user._id || req.body.userId,
        };

        //upload image to cloudinary
        let image = null;
        if (req.file) {
            const file = req.file;

            //convert image to base64
            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = "data:" + file.mimetype + ";base64," + b64;

            //upload image to cloudinary
            const uploadedImage = await cloudinary.uploader.upload(dataURI, {
                folder: "DON",
                transformation: [{ width: 500, height: 500, crop: "fill" }]
            });

            //save image to campaign data
            image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        } else {
            // Set a default image if no image is provided
            image = {
                public_id: "default_campaign_image",
                url: "https://via.placeholder.com/500x500/4F46E5/FFFFFF?text=Campaign+Image"
            };
        }

        //create campaign
        const campaign = await Campaign.create({
            ...campaignData,
            image
        });
        
        res.status(201).json({
            success: true,
            message: "Campaign created successfully",
            campaign
        });
    } catch (error) {
        console.error("ERROR IN CREATING CAMPAIGN", error);
        res.status(500).json({
            success: false,
            message: "Error in creating campaign",
            error: error.message
        });
    }
};

//get all campaigns
const getAllCampaigns = async (req, res) => {
    try {
        const currentDate = new Date();

        const allCampaigns = await Campaign.find({
            isActive: true,
            status: "approved",
            deadline: { $gte: currentDate },
            $expr: { $lt: ["$raisedAmount", "$goalAmount"] }
        }).populate("creator", "name email avatar");

        res.status(200).json({
            success: true,
            message: "All campaigns fetched successfully",
            campaigns: allCampaigns,
            count: allCampaigns.length
        });
    } catch (error) {
        console.error("ERROR IN GETTING ALL CAMPAIGNS", error);
        res.status(500).json({
            success: false,
            message: "Error in getting all campaigns",
            error: error.message
        });
    }
};

//get single campaign
const getSingleCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate("creator", "name email avatar");
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Campaign fetched successfully",
            campaign
        });
    } catch (error) {
        console.error("ERROR IN GETTING SINGLE CAMPAIGN", error);
        res.status(500).json({
            success: false,
            message: "Error in getting single campaign",
            error: error.message
        });
    }
};

//get my campaigns
const getMyCampaigns = async (req, res) => {
    try {
        const myCampaigns = await Campaign.find({ creator: req.user._id })
            .populate("creator", "name email avatar")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "My campaigns fetched successfully",
            campaigns: myCampaigns,
            count: myCampaigns.length
        });
    } catch (error) {
        console.error("ERROR IN GETTING MY CAMPAIGNS", error);
        res.status(500).json({
            success: false,
            message: "Error in getting my campaigns",
            error: error.message
        });
    }
};

//update campaign
const updateCampaign = async(req,res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        //check if campaign exists
        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }
        if(campaign.creator.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this campaign"
            });
        }
        if(campaign.status === "approved" || campaign.status === "rejected" || campaign.status === "blocked" || campaign.deadline < new Date()){
            return res.status(400).json({
                success: false,
                message: "Campaign is already approved, rejected, blocked or expired"
            });
        }
        //upload new data
        const newData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            goalAmount: parseFloat(req.body.goalAmount),
            deadline: new Date(req.body.deadline)
        }
        //upload image to cloudinary
        if(req.file){
            const file = req.file;
            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = "data:" + file.mimetype + ";base64," + b64;
            const uploadedImage = await cloudinary.uploader.upload(dataURI,{
                folder: "DON",
                transformation: [{ width: 500, height: 500, crop: "fill" }]
            });
            newData.image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            };
        }
        campaign = await Campaign.findByIdAndUpdate(req.params.id, newData,{
            new: true,
            runValidators: true
        }).populate("creator", "name email avatar");
        res.status(200).json({
            success: true,
            message: "Campaign updated successfully",
            campaign: campaign
        });
    } catch (error) {
        console.error("ERROR IN UPDATING CAMPAIGN", error);
        res.status(500).json({
            success: false,
            message: "Error in updating campaign",
            error: error.message
        });
    }
};

//delete campaign
const deleteCampaign = async(req, res) =>{
    try {
        const campaign = await Campaign.findById(req.params.id);
        //check if campaign exists
        if(!campaign){
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }
        if(campaign.creator.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this campaign"
            });
        }
        if(campaign.status !== "pending"){
            return res.status(400).json({
                success: false,
                message: "Camapign is not pending"
            });
        }
        //delete image from cloudinary
        if(campaign.image && campaign.image.public_id){
            await cloudinary.uploader.destroy(campaign.image.public_id);
        }
        await Campaign.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Campaign deleted successfully"
        });
    } catch (error) {
        console.error("ERROR IN DELETING CAMPAIGN", error);
        res.status(500).json({
            success: false,
            message: "Error in deleting campaign",
            error: error.message
        });
    }
};
module.exports = { createCampaign, getAllCampaigns, getSingleCampaign, getMyCampaigns, updateCampaign, deleteCampaign };