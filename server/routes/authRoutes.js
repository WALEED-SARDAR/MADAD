const express = require("express");
const {register, login, logout, verifyEmail, resendOTP, passwordReset, verifyPasswordReset} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/password-reset", passwordReset);
router.post("/verify-password-reset", verifyPasswordReset);


module.exports = router;