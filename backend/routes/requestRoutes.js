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
  const data = await Request.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  const item = await Item.findOne({ id: data.iId });
  const allRequests = await Request.find({ iId: data.iId });

  // accepted requester
  await sendMail(
    data.mail,
    "Request Accepted",
    `Your claim for ${data.iId} is accepted.`
  );

  // finder summary
  await sendMail(
    item.mail,
    "Item Update",
    `Accepted Request: ${data.mail}\nTotal Requests: ${allRequests.length}`
  );

  res.json(data);
});

module.exports = router;