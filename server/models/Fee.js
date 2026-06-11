const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["academic", "hostel", "transport"], required: true },
  amount: { type: Number, required: true },
  semester: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Fee", feeSchema);
