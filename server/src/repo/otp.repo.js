const otpModel = require("../../models/otp.model");

const findOtpByIdentifier = async (identifier) => {
  return await otpModel.findOne({ identifier });
};

const createOtp = async (otp) => {
  await otpModel.create(otp);
};

module.exports = {
  findOtpByIdentifier,
  createOtp,
};