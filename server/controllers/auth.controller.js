
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
    const { identifier } = req.body;
    const response = await sendOtp(identifier);
   req.session.sessionData.defaultSession = {
      ...req.session.sessionData.defaultSession,
      signupData: req.body.user,
    };
    res.json(response);
   
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

//verifyOtp Controller

const verifyOtpController = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = req.session.sessionData.defaultSession.signupData;

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
    res.json(response);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

//login Controller

const { loginUser } = require("../service/auth/auth.service");
const { exists } = require("../models/otp.model");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (err) {
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
   const user=await User.findOne({email:identifier});
   if(!user){
    return res.json({success:false,message:"User with this email doesnt exist"});
   }
   const response=await verifyOtp(identifier,otp,user);
   return res.json(response);
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error"});
  }
}


//chanhe-password

const resetPasswordController=async(req,res)=>{
  try{

    const{email,newPassword}=req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

module.exports = {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
  loginController,
  checkEmailController,
  verifyForgotPasswordOtpController,
  resetPasswordController
};
