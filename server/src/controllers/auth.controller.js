const{sendOtp,verifyOtp,resendOtp}=require("../service/auth/auth.service")


//sendOtp Controller

const sendOtpController=async(req,res)=>{
    try{
        const{identifier}=req.body;
        const response=await sendOtp(identifier);
        res.json(response);

    }
    catch(err){
        res.status(500).send({success:false,message:err.message});

    }
}

//verifyOtp Controller

const verifyOtpController=async(req,res)=>{
    try {
    const{identifier,otp}=req.body;
    const response=await verifyOtp(identifier,otp);
    res.json(response);
    }
    catch(err){
        res.status(500).send({success:false,message:"OTP could not be verified"});
    }
}

//resendOtp Controller

const resendOtpController=async(req,res)=>{
    try{
      const{identifier}=req.body;
      const response=await resendOtp(identifier);
      res.json(response);
    }
    catch(err){
      res.status(500).send({success:false,message:err.message});
    }
}

module.exports={sendOtpController,verifyOtpController,resendOtpController};