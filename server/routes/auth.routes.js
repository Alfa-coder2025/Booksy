const express = require("express");
const { sendOtpController,verifyOtpController,resendOtpController } = require("../controllers/auth.controller");

const router = express.Router();

// POST /api/auth/send-otp
router.post("/send-otp", sendOtpController);

router.post("/verify-otp",verifyOtpController);

router.post("/resend-otp",resendOtpController);

module.exports = router;