const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "rdalvi1210@gmail.com",
    pass: "gphu thpy lnrv qjpk",
  },
});

const sendMail = async () => {
  try {


  } catch (error) {
    console.log(error);
  }
};

sendMail();
