const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Fee = require("../models/Fee");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Assignment = require("../models/Assignment");
const Timetable = require("../models/Timetable");
const Hostel = require("../models/Hostel");
const Admission = require("../models/Admission");

// GET profile — merges User + Admission data
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const admission = await Admission.findOne({ generatedEmail: user.email, status: "approved" });
    res.json({ ...user.toObject(), admission: admission || null, hostelRequired: admission?.hostelRequired || false, transportRequired: admission?.transportRequired || false });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// UPDATE profile
router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET fees by type
router.get("/fees/:type", auth, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user.id, type: req.params.type }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all fees (payment history)
router.get("/fees", auth, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PAY fee
router.put("/fees/:id/pay", auth, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, { status: "paid", paidAt: new Date() }, { new: true });
    res.json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET attendance
router.get("/attendance", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET results
router.get("/results", auth, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET assignments
router.get("/assignments", auth, async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET timetable
router.get("/timetable", auth, async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ day: 1, startTime: 1 });
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET hostel
router.get("/hostel", auth, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ studentId: req.user.id, status: "active" });
    res.json(hostel);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET documents from admission
router.get("/documents", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");
    const admission = await Admission.findOne({ generatedEmail: user.email, status: "approved" });
    console.log(`Documents for ${user.email}:`, admission?.documents?.length || 0);
    res.json(admission?.documents || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
