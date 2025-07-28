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
    if (response.verified) {
      // Hashing password and create user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      await userModel.create({ ...userData, password: hashedPassword });

      return res.json({
        success: true,
        message: "OTP verified and account created",
      });
    }
     return res.json(response);

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

//login Controller

const { loginUser } = require("../service/auth/auth.service");

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



module.exports = {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
};
