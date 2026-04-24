const router = require("express").Router();
const Handover = require("../models/Handover");

router.post("/", async (req, res) => {
  const data = await Handover.create(req.body);
  res.json(data);
});

module.exports = router;