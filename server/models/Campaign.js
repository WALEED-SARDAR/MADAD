const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        maxlength:[50, "Title cannot be more than 50 characters"]
    },
    description:{
        type: String,
        required: [true, "Please add a description"]
    },
    category:{
        type: String,
        required: [true, "Please add a category"],
        enum: ["education", "medical", "emergency", "community", "creative", "business", "other"]
    },
    goalAmount:{
        type: Number,
        required: [true, "Please add a goal amount"],
        min: [1000, "Goal amount must be at least 1000"]
    },
    raisedAmount:{
        type: Number,
        default: 0
    },
    deadline:{
        type: Date,
        required: [true, "Please add a deadline"],
        validate: {
            validator: function(value){
                return value > Date.now();
            },
            message: "Deadline must be in the future"
        },
    },
    image:{
        public_id: String,
        url: String
    },
    creator:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum: ["approved", "rejected", "pending", "blocked"],
        default: "pending"
    },
    isActive:{
        type: Boolean,
        default: true
    },
    withdrawStatus:{
        type: String,
        enum: ["not_eligible", "eligible", "requested", "approved", "rejected", "paid"],
        default: "not_eligible"
    },
    withdrawDetails:{
        bankName: String,
        accountNumber: String,
        accountHolderName: String,
        requestedAt: Date,
        approvedAt: Date,
        rejectedAt: Date,
        paidAt: Date
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;