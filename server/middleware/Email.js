const nodemailer = require("nodemailer");
const generateOtpEmailTemplate = require("../libs/Emailtemplate");

// Setup transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rdalvi1210@gmail.com",
    pass: "gphu thpy lnrv qjpk",
  },
});

const sendVerificationCode = async ({ email, verificationCode }) => {
  try {
    const htmlTemplate = generateOtpEmailTemplate(verificationCode);

    const info = await transporter.sendMail({
      from: '"KailvalyaInfotech" <rdalvi1210@gmail.com>',
      to: email,
      subject: "Your KailvalyaInfotech OTP Code",
      text: `Your verification code is ${verificationCode}`, 
      html: htmlTemplate,
    });
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

module.exports = sendVerificationCode;
