const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();


const resumeRoutes = require("./routes/resumeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors(
  origin: "https://pdf-locker-1.onrender.com",
  credentials: true
));
app.use(express.json());

app.use("/api", resumeRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
