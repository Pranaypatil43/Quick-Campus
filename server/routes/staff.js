const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Fee = require("../models/Fee");
const Timetable = require("../models/Timetable");

const isStaff = (req, res, next) => {
  if (req.user.role !== "staff" && req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  next();
};

// GET staff profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all students
router.get("/students", auth, isStaff, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE assignment
router.post("/assignments", auth, isStaff, async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, staffId: req.user.id });
    res.status(201).json(assignment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all assignments
router.get("/assignments", auth, isStaff, async (req, res) => {
  try {
    const assignments = await Assignment.find({ staffId: req.user.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE assignment
router.delete("/assignments/:id", auth, isStaff, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// MARK attendance
router.post("/attendance", auth, isStaff, async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;
    const existing = await Attendance.findOne({ studentId, subject, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json(existing);
    }
    const record = await Attendance.create({ studentId, subject, date, status, markedBy: req.user.id });
    res.status(201).json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET attendance records
router.get("/attendance", auth, isStaff, async (req, res) => {
  try {
    const { subject, date } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (date) filter.date = new Date(date);
    const records = await Attendance.find(filter).populate("studentId", "name email");
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADD/UPDATE result
router.post("/results", auth, isStaff, async (req, res) => {
  try {
    const { studentId, semester, subjects } = req.body;
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const maxTotal = subjects.reduce((sum, s) => sum + (s.maxMarks || 100), 0);
    const percentage = ((totalMarks / maxTotal) * 100).toFixed(2);
    const result = percentage >= 40 ? (percentage >= 75 ? "distinction" : "pass") : "fail";
    const existing = await Result.findOne({ studentId, semester });
    if (existing) {
      Object.assign(existing, { subjects, totalMarks, percentage, result });
      await existing.save();
      return res.json(existing);
    }
    const newResult = await Result.create({ studentId, semester, subjects, totalMarks, percentage, result });
    res.status(201).json(newResult);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET results for a student
router.get("/results/:studentId", auth, isStaff, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId });
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET timetable
router.get("/timetable", auth, isStaff, async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ day: 1, startTime: 1 });
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
