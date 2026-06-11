import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaChalkboardTeacher, FaEnvelope, FaPhone, FaCalendar } from "react-icons/fa";

const ACCENT = "#0d9488";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/staff/profile").then((d) => setUser(d));
  }, []);

  const name = user?.name || localStorage.getItem("name") || "Staff Member";
  const email = user?.email || "staff@university.edu";

  const details = [
    { label: "Full Name", value: name },
    { label: "Login Email", value: email, icon: <FaEnvelope /> },
    { label: "Department", value: "Computer Science Engineering" },
    { label: "Designation", value: "Assistant Professor" },
    { label: "Phone", value: "9876543210", icon: <FaPhone /> },
    { label: "Joined On", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "01/08/2022", icon: <FaCalendar /> },
    { label: "Employee ID", value: "EMP-2022-CS-045" },
    { label: "Subjects", value: "Data Structures, OS, Computer Networks" },
  ];

  const stats = [
    { label: "Classes Today", val: "4" },
    { label: "Total Students", val: "180" },
    { label: "Assignments", val: "12" },
    { label: "Avg Attendance", val: "87%" },
  ];

  return (
    <div style={s.page}>
      <div style={s.headerCard}>
        <div style={s.avatar}><FaChalkboardTeacher style={{ fontSize: "44px", color: ACCENT }} /></div>
        <div style={s.headerInfo}>
          <h1 style={s.name}>{name}</h1>
          <p style={s.sub}>Assistant Professor · Computer Science</p>
          <span style={s.badge}>Staff</span>
        </div>
      </div>
      <div style={s.statsRow}>
        {stats.map((s_) => (
          <div key={s_.label} style={s.statCard}>
            <p style={s.statVal}>{s_.val}</p>
            <p style={s.statLabel}>{s_.label}</p>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h2 style={s.sectionTitle}>Profile Details</h2>
        <div style={s.grid}>
          {details.map(({ label, value, icon }) => (
            <div key={label} style={s.field}>
              <span style={s.label}>{label}</span>
              <span style={s.value}>{icon && <span style={{ marginRight: "6px", color: ACCENT }}>{icon}</span>}{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  headerCard: { background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "24px", border: "1px solid #99f6e4" },
  avatar: { width: "88px", height: "88px", borderRadius: "50%", background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${ACCENT}`, flexShrink: 0 },
  headerInfo: { flex: 1 },
  name: { fontSize: "24px", fontWeight: "900", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "14px", color: "#6b7280", margin: "4px 0" },
  badge: { background: "#f0fdfa", color: ACCENT, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "24px", fontWeight: "900", color: ACCENT, margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  sectionTitle: { fontSize: "15px", fontWeight: "800", color: "#1e1b4b", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "2px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" },
  value: { fontSize: "14px", color: "#374151", fontWeight: "500" },
};
