const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // ✅ for Mailtrap
  port: 2525,
  auth: {
    user: "fa1559e049c8eb", // get from Mailtrap > Email Sandbox > SMTP Settings
    pass: "e262605937c5c1",
  },
});

module.exports = transporter;