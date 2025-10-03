const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const campaignRoutes = require("./campaignRoute");
const donationRoutes = require("./donationRoute");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");


router.use("/auth", authRoutes);
router.use("/campaign", campaignRoutes);
router.use("/donation", donationRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

module.exports = router;