const transporter = require("../../config/nodemailer.config");

async function sendOtpMail(toEmail, otp) {
  const mailOptions = {
    from: "'Booksy Auth' <no-reply@booksy.com>", // sender name + email
    to: toEmail, // recipient
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOtpMail,
};