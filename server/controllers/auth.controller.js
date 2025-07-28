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
    const user=req.session.sessionData.defaultSession.signupData;
    const response = await verifyOtp(identifier, otp,user);
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: err.message });
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

module.exports = {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
};
