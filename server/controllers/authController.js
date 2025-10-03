const User = require("../models/User");
const { sendTokenResponse } = require("../utils/generateToken");
const { sendEmail, emailTemplates } = require("../utils/emailSender");

//Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
                error: "Name, email, and password are required"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                error: "User already exists"
            });
        }
        const user = await User.create({ name, email, password });

        const emailOTP = user.generateEmailVerifyOTP();
        await user.save({ validateBeforeSave: false });
        const emailTemplate = emailTemplates.emailVerification(emailOTP, user.name);
        await sendEmail({
            email: user.email,
            subject: emailTemplate.subject,
            message: emailTemplate.message
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email for verification.",
            user: user
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error in registration process",
            error: error.message
        });
    }
};

//Login User
const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        if (!user.isEmailVerified) {
            const emailOTP = user.generateEmailVerifyOTP();
            await user.save({ validateBeforeSave: false });
            const emailTemplate = emailTemplates.emailVerification(emailOTP, user.name);
            await sendEmail({
                email: user.email,
                subject: emailTemplate.subject,
                message: emailTemplate.message
            });
            console.log("Email sent successfully");
            return res.status(401).json({
                success: false,
                message: "Email not verified"
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error in login",
            error: error.message
        });
    }
};

//logout User
const logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

//Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            })
        }
        if (!user.verifyEmailOTP(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        user.isEmailVerified = true;
        user.status = "active";
        user.emailVerifyOTP = undefined;
        user.emailVerifyOTPExpire = undefined;
        await user.save({ validateBeforeSave: false });
        console.log("Email verified successfully");

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Error in verifying email:", error);
        res.status(500).json({
            success: false,
            message: "Error in verifying email",
            error: error.message
        });
    }
};

//Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            })
        }
        const emailOTP = user.generateEmailVerifyOTP();
        await user.save({ validateBeforeSave: false });
        const emailTemplate = emailTemplates.resendOTP(emailOTP, user.name);
        await sendEmail({
            email: user.email,
            subject: emailTemplate.subject,
            message: emailTemplate.message
        });
        res.status(200).json({
            success: true,
            message: "OTP resent successfully"
        })
    } catch (error) {
        console.error("Error in resending OTP:", error);
        res.status(500).json({
            success: false,
            message: "Error in resending OTP",
            error: error.message
        });
    }
};

//Reset Password
const passwordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email not verified"
            })
        }
        const passwordResetOTP = user.generatePasswordResetOTP();
        await user.save({ validateBeforeSave: false });
        const passwordResetTemplate = emailTemplates.passwordReset(passwordResetOTP, user.name);
        await sendEmail({
            email: user.email,
            subject: passwordResetTemplate.subject,
            message: passwordResetTemplate.message
        });
        res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully"
        })
    } catch (error) {
        console.error("Error in resetting password:", error);
        res.status(500).json({
            success: false,
            message: "Error in resetting password",
            error: error.message
        });
    }
};

//verify Password Reset 
const verifyPasswordReset = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if(!user.verifyPasswordResetOTP(otp)){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        user.password = newPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpire = undefined;
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in verifying password reset",
            error: error.message
        });
    }
}

module.exports = { register, login, logout, verifyEmail, resendOTP, passwordReset, verifyPasswordReset };