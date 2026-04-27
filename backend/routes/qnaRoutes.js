const router = require("express").Router();
const Qna = require("../models/Qna");

router.get("/", async (req, res) => {
  const data = await Qna.find(req.query);
  res.json(data);
});

router.post("/", async (req, res) => {
  const data = await Qna.create(req.body);
  res.json(data);
});

module.exports = router;