const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const stripe = require("../config/stripe");

// Create Stripe checkout session for donation
const createCheckoutSession = async (req, res) => {
    try {
        const { campaignId, amount } = req.body;

        // Validate amount
        if (!amount || parseFloat(amount) < 200) {
            return res.status(400).json({
                success: false,
                message: "Amount must be at least 200 PKR"
            });
        }

        // Validate campaign ID
        if (!campaignId) {
            return res.status(400).json({
                success: false,
                message: "Invalid campaign ID format"
            });
        }

        // Validate campaign exists and is approved
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(400).json({
                success: false,
                message: "Campaign not found"
            });
        }
        if (campaign.status !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Campaign is not approved"
            });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: "Donation to " + campaign.title,
                        images: campaign.image?.url ? [campaign.image.url] : []
                    },
                    unit_amount: parseFloat(amount) * 100
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}&campaign_id=${campaignId}`,
            cancel_url: `${process.env.CLIENT_URL}/campaign/${campaignId}?payment=failed`,
            metadata: {
                campaignId: campaignId,
                userId: req.user._id.toString(),
                amount: amount
            }
        });

        // Return checkout session details
        res.status(200).json({
            success: true,
            message: "Checkout session created successfully",
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error("Error in creating checkout session:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in creating checkout session",
            error: error
        });
    }
};

// Verify checkout session and create donation (idempotent)
const verifyCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        // Validate session ID
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }

        // Retrieve Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is not successful",
                payment_status: session.payment_status
            });
        }

        const { campaignId, userId, amount } = session.metadata;
        const paymentIntentId = session.payment_intent;

        //check if donation already exists
        let donation = await Donation.findOne({ stripePaymentId: paymentIntentId });
        if (!donation) {
            try {
                //create donation with duplicate handling
                donation = await Donation.create({
                    amount: parseFloat(amount),
                    campaign: campaignId,
                    donor: userId,
                    stripePaymentId: paymentIntentId,
                    status: "successful"
                });

                //update campaign raised amount
                await Campaign.findByIdAndUpdate(campaignId, {
                    $inc: { raisedAmount: parseFloat(amount) }
                });
            } catch (createError) {
                // Handle duplicate key error gracefully
                if (createError.code === 11000) {
                    console.log("Donation already exists for payment:", paymentIntentId);
                    // Fetch the existing donation
                    donation = await Donation.findOne({ stripePaymentId: paymentIntentId });
                } else {
                    throw createError; // Re-throw if it's a different error
                }
            }
        }

        // Populate campaign data for response
        await donation.populate("campaign", "title raisedAmount");

        // Return success response
        res.status(200).json({
            success: true,
            message: "Donation successfully saved",
            donation,
            campaign: donation.campaign
        });
    } catch (error) {
        console.error("Error in verifying checkout session:", error);
        res.status(500).json({
            success: false,
            message: "Error in verifying checkout session",
            error: error.message
        });
    }
};

// Handle Stripe webhook events
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error("Error in handling stripe webhook:", error);
        return res.status(400).json({
            success: false,
            message: "Error in handling stripe webhook"
        });
    }

    // Handle successful payment events
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("Payment successful via webhook:", session.id);
    }

    res.json({ received: true });
};

// Get donations for a specific campaign
const getCampaignDonations = async (req, res) => {
    try {
        const donations = await Donation.find({
            campaign: req.params.campaignId,
            status: "successful"
        })
            .populate({ path: "donor", select: "name email avatar" })
            .populate({ path: "campaign", select: "title description image raisedAmount deadline goalAmount" })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Campaign donations fetched successfully",
            donations,
            count: donations.length
        });
    } catch (error) {
        console.error("Error in getting campaign donations:", error);
        res.status(500).json({
            success: false,
            message: "Error in getting campaign donations"
        });
    }
};

// Get all donations across campaigns
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: "successful" })
            .populate({ path: "campaign", select: "title description image raisedAmount deadline goalAmount creator createdAt status" })
            .populate({ path: "donor", select: "name email avatar" })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All donations fetched successfully",
            donations,
            count: donations.length
        });
    } catch (error) {
        console.error("Error in getting all donations:", error);
        res.status(500).json({
            success: false,
            message: "Error in getting all donations"
        });
    }
};

// Get donations made by the authenticated user
const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id })
            .populate({
                path: "campaign",
                select: "title description image raisedAmount deadline goalAmount creator createdAt status",
                populate: {
                    path: "creator",
                    select: "name avatar email"
                }
            })
            .populate({ path: "donor", select: "name email avatar" })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "My donations fetched successfully",
            donations,
            count: donations.length
        });
    } catch (error) {
        console.error("Error in getting my donations:", error);
        res.status(500).json({
            success: false,
            message: "Error in getting my donations"
        });
    }
};

module.exports = { createCheckoutSession, verifyCheckoutSession, stripeWebhook, getCampaignDonations, getAllDonations, getMyDonations };