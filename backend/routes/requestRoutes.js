const router = require("express").Router();
const Request = require("../models/Request");
const Item = require("../models/Item"); // NEW
const sendMail = require("../utils/mailer"); // NEW

router.get("/", async (req, res) => {
  const data = await Request.find(req.query);
  res.json(data);
});

router.post("/", async (req, res) => {
  const data = await Request.create(req.body);

  const item = await Item.findOne({ id: data.iId });

  // notify finder
  await sendMail(
    item.mail,
    "New Claim Request",
    `Someone requested your item: ${data.iId}`
  );

  // notify claimer
  await sendMail(
    data.mail,
    "Claim Submitted",
    `Your request for ${data.iId} has been submitted.`
  );

  res.json(data);
});

router.patch("/:id", async (req, res) => {
  try {
    const data = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ error: "Request not found" });
    }

    const item = await Item.findOne({ id: data.iId });
    const allRequests = await Request.find({ iId: data.iId });

    await sendMail(
      data.mail,
      "Request Accepted",
      `Your claim for ${data.iId} is accepted.`
    );

    await sendMail(
      item.mail,
      "Item Update",
      `Accepted Request: ${data.mail}\nTotal Requests: ${allRequests.length}`
    );

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
