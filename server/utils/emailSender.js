const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.SMTP_NAME || process.env.SMTP_EMAIL}`,
        to: options.email,
        subject: options.subject,
        html: options.message 
    }

    await transporter.sendMail(message);
};

//EMAIL Templates
const emailTemplates = {
    emailVerification: (otp, userName) => ({
        subject: 'Verify Your Email',
        message: `
            <h2>Hello ${userName}</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code expires in 10 minutes.</p>
        `
    }),
    resendOTP: (otp, userName) => ({
        subject: `Resend OTP`,
        message:`
          <h2>Hello ${userName}</h2>
            <p>Your resend verification code is: <strong>${otp}</strong></p>
            <p>This code expires in 10 minutes.</p>
        `
    }),
    passwordReset: (otp, userName) => ({
        subject: 'Password Reset',
        message: `
            <h2>Hello ${userName}</h2>
            <p>Your password reset code is: <strong>${otp}</strong></p>
            <p>This code expires in 10 minutes.</p>
        `
    }),
    campaignApproved: (userName, campaignTitle) => ({
        subject: 'Campaign Approved!',
        message: `
            <h2>Congratulations ${userName}!</h2>
            <p>Your campaign "${campaignTitle}" has been approved and is now live.</p>
        `
    }),

    campaignRejected: (userName, campaignTitle) => ({
        subject: 'Campaign Review Required',
        message: `
            <h2>Hello ${userName}</h2>
            <p>Your campaign "${campaignTitle}" needs modifications.</p>
        `
    })
};

module.exports = {sendEmail, emailTemplates}