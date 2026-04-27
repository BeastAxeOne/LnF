const router = require("express").Router();
const Item = require("../models/Item");
const sendMail = require("../utils/mailer"); // NEW

router.get("/", async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const data = await Item.find(query);
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const data = await Item.findOne({ id: req.params.id });
  res.json(data);
});

router.post("/", async (req, res) => {
  const data = await Item.create(req.body);

  // EMAIL TO FINDER AFTER POST
  await sendMail(
    data.mail,
    "CUET Lost & Found - Item Posted",
    `Your item has been posted successfully.\n\nItem ID: ${data.id}`
  );

  res.json(data);
});

router.patch("/:id", async (req, res) => {
  const data = await Item.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  res.json(data);
});

module.exports = router;