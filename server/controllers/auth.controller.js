
const bcrypt = require("bcrypt");
const User=require("../models/user.model");

const {
  sendOtp,
  verifyOtp,
  resendOtp,
} = require("../service/auth/auth.service");

//sendOtp Controller

const sendOtpController = async (req, res) => {
  try {
    const { identifier,user } = req.body;

   const response = await sendOtp(identifier);
  
  if (user) {
      req.session.signupData = user;
    }
    res.json({ success: true, message: "OTP sent successfully" });
   
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

//verifyOtp Controller

const verifyOtpController = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = req.session.signupData;
    if (!user) return res.json({ success: false, message: "User data missing in session" });
    const response = await verifyOtp(identifier, otp, user);

    return res.json(response);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

//resendOtp Controller

const resendOtpController = async (req, res) => {
  try {
    const { identifier } = req.body;
    
    const response = await resendOtp(identifier); 

    console.log(`Resent OTP for ${identifier}`);

    return res.json(response);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

//login Controller

const { loginUser } = require("../service/auth/auth.service");
// const { exists } = require("../models/otp.model");

const loginController = async (req, res) => {
  try {
     
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    console.log("Login request body:", req.body);

    const result = await loginUser(email, password);
      console.log("Login result:", result);

    if (!result.success) {
      return res.status(401).json(result);
    }

    req.session.user={
      id:result.user.id||result.user._id,
      email:result.user.email,
      role:result.user.role,
    }
   console.log("✅ Session set after login:", req.session.user);
    res.json(result);
  } catch (err) {
      console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//check-email controller

const checkEmailController=async(req,res)=>{
  try{
    const{email}=req.body;
    if(!email){
      return res.status(400).json({success:false,message:"Email is required"});
    }
    const user=await User.findOne({email:email});
    if(user){
      return res.json({success:true,exists:true,message:"User with this email exists"});
    }
    else{
      return res.json({success:false,exists:false,message:"User with this email doesnt exist"});
    }

  }
  catch(error){
    res.status(500).json({success:false,message:"Server error"});
  }
}

//forgot-password email verification

const verifyForgotPasswordOtpController=async(req,res)=>{
  try{
   const{identifier,otp}=req.body;
   if (!identifier || !otp) {
      return res.json({ success: false, message: "Identifier and OTP are required" });
    }
    
   const user=await User.findOne({email:identifier});
   if(!user){
    return res.json({success:false,message:"User with this email doesnt exist"});
   }
   const response=await verifyOtp(identifier,otp,user);
   if(response.success){
    req.session.email=identifier;
    return res.json({success:true,redirect:"/changepassword"});
   }
   return res.json(response);
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error"});
  }
}


//change-password

const resetPasswordController=async(req,res)=>{
  try{
    const {email,newPassword}=req.body;
    // const email=req.session.email;
    
    if(!email){
      return res.status(400).json({ success: false, message: "Session expired. Please verify OTP again." });
    }

    const user=await User.findOne({email});
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    req.session.email = null;//clearing from session

    res.json({ success: true, message: "Password reset successfully" });
    
  }

  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

//logout controller

const logoutController=async(req,res)=>{
  
  req.session.destroy((err)=>{
    if(err){
      {
      console.error("Session destroy error:", err);
      return res.status(500).send("Logout failed");
    }
    }
    res.clearCookie("connect.sid",{path:"/",httpOnly: true,
      secure: false,});
    res.redirect("/login?loggedOut=true");
  })
    
 
 
}

module.exports = {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
  loginController,
  checkEmailController,
  verifyForgotPasswordOtpController,
  resetPasswordController,
  logoutController
};
