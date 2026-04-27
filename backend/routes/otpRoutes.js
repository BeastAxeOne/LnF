const router = require("express").Router();
const Otp = require("../models/Otp");
const sendMail = require("../utils/mailer");


// SEND OTP
router.post("/send", async (req, res) => {
  try {
    const { mail, purpose } = req.body;

    if (!mail || !purpose) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // remove old OTPs (prevents spam stacking)
    await Otp.deleteMany({ mail, purpose });

    // save OTP
    await Otp.create({
      mail,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 6 * 60 * 1000) // 6 min
    });

    // send email
    await sendMail(
      mail,
      "CUET Lost & Found OTP Verification",
      `Your OTP is: ${otp}\n\nValid for 6 minutes.\nDo not share this OTP.`
    );

    console.log("OTP SENT TO:", mail);

    res.json({ success: true });

  } catch (err) {
    console.log("OTP SEND ERROR:", err);
    res.status(500).json({ success: false });
  }
});


// VERIFY OTP
router.post("/verify", async (req, res) => {
  try {
    const { mail, otp, purpose } = req.body;

    const record = await Otp.findOne({ mail, otp, purpose });

    if (!record) {
      return res.json({ verified: false });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.json({ verified: false, reason: "expired" });
    }

    // delete all OTPs after success (one-time use)
    await Otp.deleteMany({ mail, purpose });

    res.json({ verified: true });

  } catch (err) {
    console.log("OTP VERIFY ERROR:", err);
    res.status(500).json({ verified: false });
  }
});

// TEST EMAIL
router.get("/test-mail", async (req, res) => {
  try {
    await sendMail(
      "csetwotwo@gmail.com",
      "TEST EMAIL FROM SERVER",
      "If you received this, email system is working."
    );

    res.send("Email sent successfully");
  } catch (err) {
    console.log("TEST MAIL ERROR:", err);
    res.status(500).send("Email failed");
  }
});

module.exports = router;
