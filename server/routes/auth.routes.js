const express = require("express");
const passport=require("passport");
const {preventAuthAccess,ensureAuthenticated,noCache}=require("../middlewares/authMiddleware");
const { sendOtpController,verifyOtpController,resendOtpController,checkEmailController,verifyForgotPasswordOtpController,resetPasswordController,logoutController} = require("../controllers/auth.controller");
const { loginController } = require('../controllers/auth.controller');


const router = express.Router();

router.use(noCache);
router.get("/sample", (req, res) => {
  console.log(req);
  return res.json({message:"Sample"})});
//public routes accessible when not logged in
router.get("/login", preventAuthAccess,(req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/forgotpassword", preventAuthAccess, (req, res) => res.render("forgotpassword"));
router.get("/changepassword", (req, res) => res.render("changepassword"));


// POST /api/auth/send-otp
router.post("/send-otp", sendOtpController);

router.post("/verify-otp",verifyOtpController);

router.post("/resend-otp",resendOtpController);

router.post("/login",loginController);

router.post("/check-email",checkEmailController);
router.post("/verify-forgot-otp", verifyForgotPasswordOtpController);
router.post("/change-password", resetPasswordController);

//googleoauth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/signup" }), (req, res) => {
   console.log("Logged in user:", req.user);
  res.redirect("/landingpage")});


router.get("/landing",  (req, res) => res.render("landing"));

//logout route
router.get("/logout",ensureAuthenticated,logoutController);




module.exports = router;