const router = require("express").Router();
const Request = require("../models/Request");

router.get("/", async (req, res) => {
  const data = await Request.find(req.query);
  res.json(data);
});

router.post("/", async (req, res) => {
  const data = await Request.create(req.body);
  res.json(data);
});

router.patch("/:id", async (req, res) => {
  const data = await Request.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true }
  );

  res.json(data);
});

module.exports = router;