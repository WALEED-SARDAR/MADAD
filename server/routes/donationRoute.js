const express = require("express");
const {createCheckoutSession, verifyCheckoutSession, stripeWebhook, getCampaignDonations, getAllDonations, getMyDonations} = require("../controllers/donationController");
const {protect} = require("../middlewares/auth");
const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/verify-checkout-session", protect, verifyCheckoutSession);
router.post("/stripe-webhook", stripeWebhook);
router.get("/campaign/:campaignId", getCampaignDonations);
router.get("/campaigns", getAllDonations);
router.get("/my-donations", protect, getMyDonations);

module.exports = router;