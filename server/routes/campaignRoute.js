const express = require("express");
const router = express.Router();
const {upload, errorHandler} = require("../middlewares/upload");
const {protect} = require("../middlewares/auth");
const {createCampaign, getAllCampaigns, getSingleCampaign, getMyCampaigns, updateCampaign, deleteCampaign} = require("../controllers/campaignController");

// Public routes
router.get("/all", getAllCampaigns);
router.get("/my-campaigns", protect, getMyCampaigns);
router.get("/:id", getSingleCampaign);

// Protected routes (require authentication)
router.post("/create", protect, upload.single("image"), createCampaign);
router.put("/update/:id", protect, upload.single("image"), updateCampaign);
router.delete("/delete/:id", protect, deleteCampaign);

router.use(errorHandler);

module.exports = router;

