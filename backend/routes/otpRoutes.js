const router = require("express").Router();
const Otp = require("../models/Otp");

// SEND OTP
router.post("/send", async (req, res) => {
  const { mail, purpose } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    mail,
    otp,
    purpose,
    expiresAt: new Date(Date.now() + 6 * 60 * 1000) // 6 min validity
  });

  console.log("OTP GENERATED:", otp); // replace with email later

  res.json({ success: true });
});

// VERIFY OTP
router.post("/verify", async (req, res) => {
  const { mail, otp, purpose } = req.body;

  const record = await Otp.findOne({ mail, otp, purpose });

  if (!record) {
    return res.json({ verified: false });
  }

  if (record.expiresAt < new Date()) {
    return res.json({ verified: false, reason: "expired" });
  }

  await Otp.deleteMany({ mail, purpose });

  res.json({ verified: true });
});

router.get("/test-mail", async (req, res) => {
  const sendMail = require("../utils/mailer");

  try {
    await sendMail(
      "csetwotwo@gmail.com",
      "TEST EMAIL FROM SERVER",
      "If you received this, email system is working."
    );

    res.send("Email sent successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Email failed");
  }
});

module.exports = router;
