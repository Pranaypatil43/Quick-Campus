import React, { useState } from "react";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

const ACCENT = "#0d9488";

const classes = [
  { subject: "Data Structures", class: "SE-CS-A", time: "09:00 - 10:00", room: "CS-101" },
  { subject: "Computer Networks", class: "SE-CS-B", time: "10:00 - 11:00", room: "CS-102" },
  { subject: "Operating Systems", class: "TE-CS-A", time: "02:00 - 03:00", room: "CS-103" },
];

const students = [
  { id: 1, name: "Pranay Patil", roll: "SE-CS-001" },
  { id: 2, name: "Rahul Sharma", roll: "SE-CS-002" },
  { id: 3, name: "Priya Mehta", roll: "SE-CS-003" },
  { id: 4, name: "Amit Joshi", roll: "SE-CS-004" },
  { id: 5, name: "Sneha Kulkarni", roll: "SE-CS-005" },
  { id: 6, name: "Rohan Desai", roll: "SE-CS-006" },
  { id: 7, name: "Pooja Patil", roll: "SE-CS-007" },
  { id: 8, name: "Vikram Singh", roll: "SE-CS-008" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  const toggle = (id, status) => setAttendance((prev) => ({ ...prev, [id]: status }));
  const markAll = (status) => { const a = {}; students.forEach((s) => a[s.id] = status); setAttendance(a); };

  const present = Object.values(attendance).filter((v) => v === "present").length;
  const absent = Object.values(attendance).filter((v) => v === "absent").length;

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Attendance</h2>
      <p style={s.sub}>Today: {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>

      {/* Today's Classes */}
      <div style={s.classGrid}>
        {classes.map((c, i) => (
          <div key={i} style={{ ...s.classCard, border: `2px solid ${selectedClass === i ? ACCENT : "#e5e7eb"}` }} onClick={() => { setSelectedClass(i); setAttendance({}); setSaved(false); }}>
            <p style={s.classSubject}>{c.subject}</p>
            <p style={s.classMeta}>{c.class} · {c.room}</p>
            <p style={s.classTime}><FaClock style={{ marginRight: "4px" }} />{c.time}</p>
          </div>
        ))}
      </div>

      {selectedClass !== null && (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div>
              <h3 style={s.cardTitle}>{classes[selectedClass].subject} — {classes[selectedClass].class}</h3>
              <p style={s.cardSub}>{students.length} students · {present} present · {absent} absent</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={s.markAllBtn("#dcfce7", "#16a34a")} onClick={() => markAll("present")}>✓ All Present</button>
              <button style={s.markAllBtn("#fee2e2", "#dc2626")} onClick={() => markAll("absent")}>✗ All Absent</button>
            </div>
          </div>

          <div style={s.studentList}>
            {students.map((st) => {
              const status = attendance[st.id];
              return (
                <div key={st.id} style={s.studentRow}>
                  <div style={s.studentInfo}>
                    <div style={s.avatar}>{st.name.charAt(0)}</div>
                    <div>
                      <p style={s.studentName}>{st.name}</p>
                      <p style={s.studentRoll}>{st.roll}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={s.statusBtn(status === "present", "#16a34a")} onClick={() => toggle(st.id, "present")}><FaCheck /></button>
                    <button style={s.statusBtn(status === "absent", "#dc2626")} onClick={() => toggle(st.id, "absent")}><FaTimes /></button>
                  </div>
                </div>
              );
            })}
          </div>

          <button style={s.saveBtn} onClick={save}>{saved ? "✓ Saved!" : "Save Attendance"}</button>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: 0 },
  classGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "12px" },
  classCard: { background: "#fff", borderRadius: "12px", padding: "16px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "border-color 0.2s" },
  classSubject: { fontSize: "14px", fontWeight: "700", color: "#1e1b4b", margin: "0 0 4px" },
  classMeta: { fontSize: "12px", color: "#6b7280", margin: "0 0 6px" },
  classTime: { fontSize: "12px", color: ACCENT, fontWeight: "600", display: "flex", alignItems: "center" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "10px" },
  cardTitle: { fontSize: "16px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  cardSub: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
  markAllBtn: (bg, color) => ({ padding: "7px 14px", borderRadius: "8px", border: "none", background: bg, color, fontWeight: "700", cursor: "pointer", fontSize: "13px" }),
  studentList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  studentRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #f3f4f6" },
  studentInfo: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", background: `${ACCENT}20`, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" },
  studentName: { fontSize: "14px", fontWeight: "600", color: "#1e1b4b", margin: 0 },
  studentRoll: { fontSize: "12px", color: "#9ca3af", margin: 0 },
  statusBtn: (active, color) => ({ width: "34px", height: "34px", borderRadius: "8px", border: `2px solid ${active ? color : "#e5e7eb"}`, background: active ? color : "#fff", color: active ? "#fff" : "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }),
  saveBtn: { width: "100%", padding: "12px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px" },
};
