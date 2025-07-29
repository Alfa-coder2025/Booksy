/*
const { findOtpByIdentifier, createOtp } = require("../../repo/otp/otp.repo");
const { sendOtpMail } = require("./auth.helper");
const { generateOtp, getOtpExpireAtAndDeleteAt } = require("../../utils/utils");

const sendOtp = async (identifier) => {
  let otpRecord = await findOtpByIdentifier(identifier);
  const now = new Date();
  const { expiresAt, deleteAt } = getOtpExpireAtAndDeleteAt();
  const generatedOtp = generateOtp(); // e.g., 4-digit number

  if (otpRecord) {
    const isExpired = otpRecord.expiresAt <= now;

    if (otpRecord.isUsed || isExpired) {
      // Update existing OTP record
      otpRecord.otp = generatedOtp;
      otpRecord.isUsed = false;
      otpRecord.expiresAt = expiresAt;
      otpRecord.deleteAt = deleteAt;
      await otpRecord.save();
    }
  } else {
    // No existing OTP: create a new one
    otpRecord = {
      identifier,
      otp: generatedOtp,
      isUsed: false,
      expiresAt,
      deleteAt: deleteAt,
    };
    await createOtp(otpRecord);
  }

  // Send OTP via email
  await sendOtpMail(identifier, otpRecord.otp);
};
*/

//another sendOtp

const OTP = require("../../models/otp.model");
const nodemailer = require("nodemailer");
const transporter=require("../../config/nodemailer.config");
const { generateOtp } = require("../../utils/utils");
const userModel = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//scenarios: 1. new record(sign up)-insertinto otp collection 2. resend 3. below expiryDate and not used then return old otp.

//checking for existing OTP

async function sendOtp(identifier) {
  const existingOtp = await OTP.findOne({
    identifier,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (existingOtp) {
    await deliverOtpEmail(identifier, existingOtp.otp);
    return {
      success: true,
      message: "Existing valid OTP returned",
    };
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //5 minutes later
  const deleteAt = new Date(Date.now() + 10 * 60 * 1000); //10 minutes later
  
  await OTP.findOneAndUpdate(
    { identifier },
    {
      identifier,
      otp,
      createdAt: new Date(),
      expiresAt,
      deleteAt,
      isUsed: false,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  //send email
  await deliverOtpEmail(identifier, otp);

  //for testing
  console.log(`OTP for ${identifier} : ${otp}`);

  return {
    success: true,
    message: "OTP sent",
  };
}

async function deliverOtpEmail(identifier, otp) {
  await transporter.sendMail({
    from: "'Booksy auth' <noreply@booksy.com>",
    to: identifier,
    subject: "Your OTP code",
    text: `Your OTP is ${otp}.It expires in 5 minutes`,
  });
}

//resend Otp
async function resendOtp(identifier) {
  await OTP.updateMany(
    { identifier, isUsed: false },
    { $set: { expiresAt: new Date(0) } }
  );
  return sendOtp(identifier);
}

//verify otp
async function verifyOtp(identifier, inputOtp,user) {
  //finding most recent valid  Otp
  const otpRecord = await OTP.findOne({
    identifier,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  //case 1: OTP not found
  if (!otpRecord) {
    return {
      success: false,
      message: "OTP not found.Request a new one",
    };
  }

  //case 2: OTP attempts exceed
  if (otpRecord.attempts >= 3) {
    await OTP.findByIdAndUpdate(otpRecord._id, { expiresAt: new Date(0) });

    return {
      success: false,
      message: "Too many Attempts:OTP Expired",
    };
  }

  //case 3: OTP doesnt match
  if (otpRecord.otp !== inputOtp) {
    //increment attempts
    await OTP.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
    const updatedRecord = await OTP.findById(otpRecord._id);
    const remainingAttempts = 3 - updatedRecord.attempts;
    return {
      success: false,
      message: `Invalid OTP, ${remainingAttempts} attempts remaining`,
    };
  }

  //case 4: Successful Validation
  else {
    await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });
    if (!user || !user.password) {
  return { success: false, message: "Missing user details" };
}
    //insert user details in db
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;

    await userModel.create(user);
    
    return {
      success: true,
      message: "OTP verified and account created successfully",
      verified:true,
    
    };
  }
}


const loginUser = async (email, inputPassword) => {

  const user = await userModel.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isMatch = user.role==="admin"?true:await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) {
    return { success: false, message: "Invalid credentials" };
  }

  const token = generateToken(user);

  return {
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};




const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // 'admin' or 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};



//insert user record after verify

module.exports = {
  sendOtp,
  resendOtp,
  verifyOtp,
  loginUser,
};
