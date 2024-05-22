const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use("/user/appointment", require("./routes/appointmentRoutes"));
app.use("/counsellor", require("./routes/counsellorRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
