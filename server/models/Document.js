const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["id_proof", "marksheet", "certificate", "other"], required: true },
  fileUrl: { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);
