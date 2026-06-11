const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  type: { type: String, enum: ["holiday", "exam", "event", "deadline"], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Calendar", calendarSchema);
