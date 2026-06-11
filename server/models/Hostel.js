const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomNumber: { type: String, required: true },
  block: { type: String },
  allotedDate: { type: Date },
  status: { type: String, enum: ["active", "vacated"], default: "active" },
  monthlyFee: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
