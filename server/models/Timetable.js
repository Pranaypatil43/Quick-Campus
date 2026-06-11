const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], required: true },
  subject: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  semester: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
