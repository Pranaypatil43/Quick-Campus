import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaClipboardList, FaArrowLeft, FaGraduationCap } from "react-icons/fa";

const C = { indigo: "#4f46e5", coral: "#f97316", teal: "#0d9488", text: "#1e1b4b", muted: "#6b7280", border: "#e5e7eb", bg: "#fafaf8", white: "#ffffff" };

const cards = [
  { role: "admin", label: "Admin Portal", icon: <FaUserShield />, desc: "Manage admissions, finance, hostel & access control", accent: C.indigo, bg: "#eef2ff" },
  { role: "staff", label: "Staff Portal", icon: <FaChalkboardTeacher />, desc: "Assignments, grades, attendance & student lookup", accent: C.teal, bg: "#f0fdfa" },
  { role: "student", label: "Student Portal", icon: <FaUserGraduate />, desc: "Fees, results, timetable & documents", accent: C.coral, bg: "#fff7ed" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eef2ff 0%, #fef3c7 50%, #f0fdfa 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Back */}
      <button onClick={() => navigate("/")} style={{ position: "fixed", top: "24px", left: "24px", background: C.white, border: `1px solid ${C.border}`, color: C.muted, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <FaArrowLeft /> Back to Home
      </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
        <div style={{ width: "44px", height: "44px", background: `linear-gradient(135deg, ${C.indigo}, ${C.coral})`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaGraduationCap style={{ color: "#fff", fontSize: "20px" }} />
        </div>
        <span style={{ fontSize: "26px", fontWeight: "900", color: C.indigo }}>QuickCampus</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", color: C.text, marginBottom: "10px", textAlign: "center" }}>Select Your Portal</h1>
      <p style={{ color: C.muted, fontSize: "16px", marginBottom: "48px", textAlign: "center" }}>Choose your role to access your personalized dashboard</p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {cards.map(({ role, label, icon, desc, accent, bg }) => (
          <div key={role} onClick={() => navigate(`/login/${role}`)}
            style={{ background: C.white, border: `2px solid ${C.border}`, borderRadius: "20px", padding: "36px 28px", width: "230px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.12)`; e.currentTarget.style.background = bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.background = C.white; }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `${accent}15`, border: `2px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: accent, margin: "0 auto 20px" }}>{icon}</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: C.text, marginBottom: "8px" }}>{label}</div>
            <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.6, marginBottom: "20px" }}>{desc}</div>
            <div style={{ padding: "9px 0", background: accent, borderRadius: "10px", fontSize: "14px", fontWeight: "700", color: "#fff" }}>Login →</div>
          </div>
        ))}
      </div>

      <div onClick={() => navigate("/admission")}
        style={{ marginTop: "40px", padding: "14px 36px", background: C.white, border: `2px solid ${C.coral}`, color: C.coral, borderRadius: "12px", cursor: "pointer", fontWeight: "800", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.coral; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.coral; }}
      >
        <FaClipboardList /> Apply for Admission
      </div>
    </div>
  );
}
