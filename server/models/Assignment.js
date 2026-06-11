const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    submittedAt: { type: Date },
    fileUrl: { type: String },
    grade: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
