require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const itemRoutes = require("./routes/itemRoutes");
const requestRoutes = require("./routes/requestRoutes");
const qnaRoutes = require("./routes/qnaRoutes");
const handoverRoutes = require("./routes/handoverRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/qna", qnaRoutes);
app.use("/api/handovers", handoverRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});