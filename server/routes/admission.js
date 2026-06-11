const router = require("express").Router();
const Admission = require("../models/Admission");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendEmail, approvalEmailHtml, parentEmailHtml, getWhatsAppLink } = require("../utils/notify");

// Test email route (no auth needed)
router.post("/test-email", async (req, res) => {
  try {
    const { sendEmail, approvalEmailHtml } = require("../utils/notify");
    const ok = await sendEmail(
      req.body.email || process.env.BREVO_SENDER_EMAIL,
      "Test",
      "Test Email from University ERP",
      approvalEmailHtml("Test User", "test@university.edu", "Test@123", "student")
    );
    res.json({ success: ok, message: ok ? "Email sent" : "Email failed - check server logs" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit admission form (public)
router.post("/apply", async (req, res) => {
  try {
    const existing = await Admission.findOne({ email: req.body.email });
    if (existing)
      return res.status(400).json({ message: "Application with this email already exists" });
    const admission = await Admission.create(req.body);
    res.status(201).json({ message: "Application submitted successfully", id: admission._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all admissions - admin only
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve admission - admin only
router.post("/approve/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const admission = await Admission.findById(req.params.id);
    if (!admission)
      return res.status(404).json({ message: "Admission not found" });
    if (admission.status === "approved")
      return res.status(400).json({ message: "Already approved" });

    // Generate credentials
    const generatedEmail = `${admission.fullName.toLowerCase().replace(/\s+/g, ".")}.${Date.now().toString().slice(-4)}@university.edu`;
    const generatedPassword = Math.random().toString(36).slice(-8) + "A1!";

    // Create user account
    await User.create({
      name: admission.fullName,
      email: generatedEmail,
      password: generatedPassword,
      role: admission.role,
    });

    // Update admission status
    admission.status = "approved";
    admission.generatedEmail = generatedEmail;
    admission.generatedPassword = generatedPassword;
    admission.approvedBy = req.user.id;
    admission.approvedAt = new Date();
    await admission.save();

    // Send email to student
    await sendEmail(
      admission.email,
      admission.fullName,
      "🎓 Admission Approved - Your Login Credentials",
      approvalEmailHtml(admission.fullName, generatedEmail, generatedPassword, admission.role)
    );

    // Send email to parent if email exists
    if (admission.parentEmail) {
      await sendEmail(
        admission.parentEmail,
        admission.parentName || "Parent",
        "🎓 Your Ward's Admission Has Been Approved",
        parentEmailHtml(admission.fullName, admission.parentName, admission.role)
      );
    }

    // WhatsApp links
    const studentWhatsApp = admission.phone ? getWhatsAppLink(admission.phone, admission.fullName, generatedEmail, generatedPassword) : null;
    const parentWhatsApp = admission.parentPhone ? getWhatsAppLink(admission.parentPhone, admission.fullName, generatedEmail, generatedPassword) : null;

    res.json({
      message: "Admission approved",
      credentials: { email: generatedEmail, password: generatedPassword },
      studentWhatsApp,
      parentWhatsApp,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject admission - admin only
router.post("/reject/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await Admission.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Admission rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get hostel requests - admin only
router.get("/hostel-requests", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const requests = await Admission.find({ hostelRequired: true }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Allot hostel room - admin only
router.post("/allot-hostel/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    const { roomNumber, block } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { hostelStatus: "allotted", allottedRoom: roomNumber, allottedBlock: block },
      { new: true }
    );
    res.json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject hostel request - admin only
router.post("/reject-hostel/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    await Admission.findByIdAndUpdate(req.params.id, { hostelStatus: "rejected" });
    res.json({ message: "Hostel request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
