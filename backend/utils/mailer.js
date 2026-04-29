const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
});

const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.BREVO_EMAIL,
    to,
    subject,
    text
  });
};

module.exports = sendMail;
