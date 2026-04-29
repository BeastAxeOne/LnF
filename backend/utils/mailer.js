const axios = require("axios");

const sendMail = async (to, subject, text) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Lost & Found",
        email: process.env.BREVO_EMAIL
      },
      to: [{ email: to }],
      subject,
      textContent: text
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
};

module.exports = sendMail;
