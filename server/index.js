require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /\.vercel\.app$/,
    ];
    if (!origin || allowed.some((pattern) => pattern.test(origin))) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "QuickCampus API is running" });
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admission", require("./routes/admission"));
app.use("/api/student", require("./routes/student"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/admin", require("./routes/admin"));

// Load all models
require("./models/Admission");
require("./models/Fee");
require("./models/Assignment");
require("./models/Attendance");
require("./models/Result");
require("./models/Timetable");
require("./models/Document");
require("./models/Hostel");
require("./models/Calendar");

// Start server regardless of DB connection
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 15000,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));
