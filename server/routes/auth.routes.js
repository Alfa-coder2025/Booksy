const express = require("express");
const { sendOtpController,verifyOtpController,resendOtpController,checkEmailController,verifyForgotPasswordOtpController,resetPasswordController } = require("../controllers/auth.controller");
const { loginController } = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/send-otp
router.post("/send-otp", sendOtpController);

router.post("/verify-otp",verifyOtpController);

router.post("/resend-otp",resendOtpController);

router.post("/login", loginController);

router.post("/check-email",checkEmailController);
router.post("/verify-forgot-otp", verifyForgotPasswordOtpController);
router.post("/reset-password", resetPasswordController);


module.exports = router;