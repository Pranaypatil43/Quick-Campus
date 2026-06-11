const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Fee = require("../models/Fee");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Hostel = require("../models/Hostel");
const Timetable = require("../models/Timetable");
const Admission = require("../models/Admission");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  next();
};

// Dashboard stats
router.get("/dashboard", auth, isAdmin, async (req, res) => {
  try {
    const [students, staff, admissions, fees, pendingFees] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "staff" }),
      Admission.countDocuments({ status: "pending" }),
      Fee.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Fee.countDocuments({ status: "pending" }),
    ]);
    res.json({
      totalStudents: students,
      totalStaff: staff,
      pendingAdmissions: admissions,
      totalRevenue: fees[0]?.total || 0,
      pendingFees,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all users
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE fee for student
router.post("/fees", auth, isAdmin, async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all fees
router.get("/fees", auth, isAdmin, async (req, res) => {
  try {
    const fees = await Fee.find().populate("studentId", "name email").sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// CREATE timetable entry
router.post("/timetable", auth, isAdmin, async (req, res) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE timetable entry
router.delete("/timetable/:id", auth, isAdmin, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET timetable
router.get("/timetable", auth, isAdmin, async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ day: 1, startTime: 1 });
    res.json(timetable);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Hostel allotment
router.post("/hostel", auth, isAdmin, async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json(hostel);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all hostel records
router.get("/hostel", auth, isAdmin, async (req, res) => {
  try {
    const records = await Hostel.find().populate("studentId", "name email").sort({ createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
