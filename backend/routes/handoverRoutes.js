const router = require("express").Router();
const Handover = require("../models/Handover");
const Item = require("../models/Item");
const Request = require("../models/Request");
const sendMail = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { id, iId, rId } = req.body;

  const data = await Handover.create(req.body);

  // mark item closed
  await Item.findOneAndUpdate(
    { id: iId },
    { status: "closed" }
  );

  const request = await Request.findOne({ id: rId });
  const item = await Item.findOne({ id: iId });

  // notify finder
  await sendMail(
    item.mail,
    "Item Successfully Handed Over",
    `Your item (${iId}) has been successfully returned.\nAccepted by: ${request.mail}`
  );

  // notify claimer
  await sendMail(
    request.mail,
    "Handover Successful",
    `You have successfully received item ${iId}.\nFinder email: ${item.mail}`
  );

  res.json(data);
});

module.exports = router;