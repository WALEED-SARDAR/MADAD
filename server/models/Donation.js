const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: [true, "Please add an amount"],
        min: [100, "Amount must be at least 100"]
    },
    campaign:{
        type: mongoose.Schema.ObjectId,
        ref: "Campaign",
        required: true 
    },
    donor:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending"
    },
    stripePaymentId:{
        type: String,
        required: true,
        unique: true // Ensure unique payment IDs
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// Add indexes for better performance and duplicate prevention
donationSchema.index({ stripePaymentId: 1 }, { unique: true });
donationSchema.index({ campaign: 1, donor: 1, createdAt: -1 });
donationSchema.index({ donor: 1, createdAt: -1 });

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;