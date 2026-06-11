const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  semester: { type: String, required: true },
  subjects: [{
    name: { type: String, required: true },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String },
  }],
  totalMarks: { type: Number },
  percentage: { type: Number },
  result: { type: String, enum: ["pass", "fail", "distinction"], },
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
