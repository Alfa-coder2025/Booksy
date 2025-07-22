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

const OTP=require("../../models/otp.model");
const nodemailer=require("nodemailer");
const transporter=require("../../config/nodemailer.config");
const {generateOtp}=require("../../utils/utils");
//scenarios: 1. new record(sign up)-insertinto otp collection 2. resend 3. below expiryDate and not used then return old otp.

//checking for existing OTP

async function sendOtp(identifier){
    const existingOtp=await OTP.findOne({identifier,isUsed:false,expiresAt:{$gt:new Date()}});
    
    if(existingOtp){
        await deliverOtpEmail(identifier,existingOtp.otp);
         return{
            success:true,
            message:"Existing valid OTP returned"
        }
    }

    const otp=generateOtp();
    const expiresAt=new Date(Date.now()+5*60*1000);//5 minutes later
    const deleteAt = new Date(Date.now() + 10 * 60 * 1000); //10 minutes later
    await OTP.findOneAndUpdate({identifier},{identifier,otp,createdAt:new Date(),expiresAt,deleteAt,isUsed:false,attempts:0},{upsert:true,new:true});
    

    //send email
   await deliverOtpEmail(identifier,otp);
    
    //for testing
    console.log(`OTP for ${identifier} : ${otp}`);

    return{
        success:true,
        message:"OTP sent"
    }

    
 }

  async function deliverOtpEmail(identifier,otp){
    await transporter.sendMail({
    from:"'Booksy auth' <noreply@booksy.com>",
    to:identifier,
    subject:"Your OTP code",
    text:`Your OTP is ${otp}.It expires in 5 minutes`
   })
}

   //resend Otp
async function resendOtp(identifier){
 await OTP.updateMany({identifier,isUsed:false},{$set:{expiresAt:new Date(0)}})
 return sendOtp(identifier);
}


//verify otp
async function verifyOtp(identifier,inputOtp){
//finding most recent valid  Otp
 const otpRecord=await OTP.findOne({identifier,isUsed:false,expiresAt:{$gt:new Date()}}).sort({createdAt:-1});

 //case 1: OTP not found
 if(!otpRecord){
    return{
        success:false,
        message:"OTP not found.Request a new one"
    }
 }

 //case 2: OTP attempts exceed
 if(otpRecord.attempts>=3){

    await OTP.findByIdAndUpdate(otpRecord._id,{expiresAt:new Date(0)})

    return{
        success:false,
        message:"Too many Attempts:OTP Expired"
    }
 }

//case 3: OTP doesnt match
 if(otpRecord.otp!==inputOtp){
    //increment attempts
    await OTP.findByIdAndUpdate(otpRecord._id,{$inc:{attempts:1}})

    const remainingAttempts=3-otpRecord.attempts;
    return{
        success:false,
        message:`Invalid OTP, ${remainingAttempts} attempts remaining`
    }   
 }

  //case 4: Successful Validation
else{
    await OTP.findByIdAndUpdate(otpRecord._id,{isUsed:true})
    
    return{
    success:true,
    message:"OTP verified successfully"
 }
 
}
}

module.exports = {
    sendOtp,
    resendOtp,
    verifyOtp
}; 