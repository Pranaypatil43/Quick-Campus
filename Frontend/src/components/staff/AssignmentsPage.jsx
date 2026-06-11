import React, { useState } from "react";
import { FaBook, FaCalendar, FaUsers, FaExternalLinkAlt, FaPlus } from "react-icons/fa";

const ACCENT = "#0d9488";

const assignments = [
  { id: 1, title: "Binary Search Tree Implementation", subject: "Data Structures", class: "SE-CS-A", dueDate: "2025-08-20", submissions: 38, total: 45, classroomLink: "https://classroom.google.com" },
  { id: 2, title: "TCP/IP Protocol Analysis", subject: "Computer Networks", class: "SE-CS-B", dueDate: "2025-08-18", submissions: 42, total: 44, classroomLink: "https://classroom.google.com" },
  { id: 3, title: "Process Scheduling Simulation", subject: "Operating Systems", class: "SE-CS-A", dueDate: "2025-08-25", submissions: 20, total: 45, classroomLink: "https://classroom.google.com" },
  { id: 4, title: "ER Diagram for Library System", subject: "Data Structures", class: "SE-CS-B", dueDate: "2025-08-15", submissions: 44, total: 44, classroomLink: "https://classroom.google.com" },
  { id: 5, title: "Software Requirements Document", subject: "Computer Networks", class: "TE-CS-A", dueDate: "2025-08-22", submissions: 30, total: 48, classroomLink: "https://classroom.google.com" },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState("all");
  const subjects = ["all", ...new Set(assignments.map((a) => a.subject))];
  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.subject === filter);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Assignments</h2>
          <p style={s.sub}>Manage via Google Classroom · {assignments.length} total</p>
        </div>
        <a href="https://classroom.google.com" target="_blank" rel="noreferrer" style={s.addBtn}>
          <FaPlus style={{ marginRight: "6px" }} /> Create on Classroom
        </a>
      </div>

      <div style={s.statsRow}>
        {[{ label: "Total", val: assignments.length, color: ACCENT }, { label: "Pending Grading", val: assignments.filter(a => a.submissions < a.total).length, color: "#f97316" }, { label: "Fully Submitted", val: assignments.filter(a => a.submissions === a.total).length, color: "#16a34a" }].map((s_) => (
          <div key={s_.label} style={s.statCard}>
            <p style={{ ...s.statVal, color: s_.color }}>{s_.val}</p>
            <p style={s.statLabel}>{s_.label}</p>
          </div>
        ))}
      </div>

      <div style={s.filters}>
        {subjects.map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>{f === "all" ? "All Subjects" : f}</button>
        ))}
      </div>

      {filtered.map((a) => {
        const pct = Math.round((a.submissions / a.total) * 100);
        return (
          <div key={a.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.icon}><FaBook /></div>
              <div style={s.info}>
                <p style={s.aTitle}>{a.title}</p>
                <p style={s.meta}>{a.subject} · {a.class}</p>
              </div>
              <a href={a.classroomLink} target="_blank" rel="noreferrer" style={s.classBtn}><FaExternalLinkAlt /></a>
            </div>
            <div style={s.progress}>
              <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${pct}%` }} /></div>
              <span style={s.progressText}>{a.submissions}/{a.total} submitted ({pct}%)</span>
            </div>
            <div style={s.footer}>
              <span style={s.due}><FaCalendar style={{ marginRight: "4px" }} />Due: {new Date(a.dueDate).toLocaleDateString()}</span>
              <span style={s.studCount}><FaUsers style={{ marginRight: "4px" }} />{a.total} students</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
  addBtn: { padding: "10px 20px", background: ACCENT, color: "#fff", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "24px", fontWeight: "900", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "7px 16px", borderRadius: "20px", border: `1px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  card: { background: "#fff", borderRadius: "12px", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTop: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  icon: { width: "40px", height: "40px", background: "#f0fdfa", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: "18px", flexShrink: 0 },
  info: { flex: 1 },
  aTitle: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  meta: { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },
  classBtn: { color: ACCENT, fontSize: "16px" },
  progress: { marginBottom: "10px" },
  progressBar: { height: "6px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", marginBottom: "4px" },
  progressFill: { height: "100%", background: ACCENT, borderRadius: "4px" },
  progressText: { fontSize: "12px", color: "#6b7280" },
  footer: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#9ca3af", paddingTop: "10px", borderTop: "1px solid #f3f4f6" },
  due: { display: "flex", alignItems: "center" },
  studCount: { display: "flex", alignItems: "center" },
};
