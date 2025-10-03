const mongoose = require(`mongoose`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Please Enter Name`],
        maxLength: [20, `name under 20 Characters`]
    },
    email: {
        type: String,
        required: [true, `Please enter Email`],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, `Pease enter password`],
        minLength: [6, `Must be Greater than 6 Characters`]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifyOTP: String,
    emailVerifyOTPExpire: Date,
    passwordResetOTP: String,
    passwordResetOTPExpire: Date,

    //Account Status
    status: {
        type: String,
        enum: ["pending", "active", "blocked"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Encrypt Password Bfore Saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

//Generate Email OTP
userSchema.methods.generateEmailVerifyOTP = function () {
    const otp = Math.floor(1000 + Math.random() * 900000).toString();
    this.emailVerifyOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex"),
        this.emailVerifyOTPExpire = Date.now() + 10 * 60 * 1000;
    return otp;
};

//Verify Email OTP
userSchema.methods.verifyEmailOTP = function (otp) {
    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
    return hashedOTP === this.emailVerifyOTP && this.emailVerifyOTPExpire > Date.now();
};

//Generate Password Reset OTP
userSchema.methods.generatePasswordResetOTP = function () {
    const otp = Math.floor(1000 + Math.random() * 900000).toString();
    this.passwordResetOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
    this.passwordResetOTPExpire = Date.now() + 10 * 60 * 1000;
    return otp;
};

//Verify Password Reset OTP
userSchema.methods.verifyPasswordResetOTP = function (otp) {
    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
    return hashedOTP === this.passwordResetOTP && this.passwordResetOTPExpire > Date.now();
};

//Generate Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;