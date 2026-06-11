const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  role: { type: String, enum: ["student", "staff"], required: true },

  // Student specific
  branch: { type: String },
  doa: { type: Date }, // date of admission
  previousSchool: { type: String },

  // Parent details
  parentName: { type: String },
  parentEmail: { type: String },
  parentPhone: { type: String },

  // Staff specific
  department: { type: String },
  designation: { type: String },

  // Hostel
  hostelRequired: { type: Boolean, default: false },
  hostelPreference: { type: String, enum: ["single", "double", "triple", ""], default: "" },
  hostelStatus: { type: String, enum: ["not_requested", "pending", "allotted", "rejected"], default: "not_requested" },
  allottedRoom: { type: String },
  allottedBlock: { type: String },

  // Transport
  transportRequired: { type: Boolean, default: false },
  transportRoute: { type: String },

  // Documents
  documents: [{
    name: { type: String },
    fileUrl: { type: String },
  }],

  // Status
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  // Generated credentials after approval
  generatedEmail: { type: String },
  generatedPassword: { type: String },

  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },

  // Payment
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentAmount: { type: Number },
  paymentMethod: { type: String },
  paymentDate: { type: Date },
  transactionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Admission", admissionSchema);
