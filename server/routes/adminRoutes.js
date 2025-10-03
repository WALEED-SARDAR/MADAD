const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/auth");
const {getAllUsers, getAllCampaigns, approveCampaign, rejectCampaign, blockUnblockCampaign, blockUnblockUser, deleteUser} = require("../controllers/adminController");

router.get("/users", protect, getAllUsers);
router.get("/campaigns", protect, getAllCampaigns);
router.put("/campaigns/:id/approve", protect, approveCampaign);
router.put("/campaigns/:id/reject", protect, rejectCampaign);
router.put("/campaigns/:id/block", protect, blockUnblockCampaign);
router.put("/users/:userId/block", protect, blockUnblockUser);
router.delete("/users/:userId", protect, deleteUser);

module.exports = router;