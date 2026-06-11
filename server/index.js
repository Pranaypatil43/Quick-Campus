require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
