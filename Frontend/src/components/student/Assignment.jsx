import React, { useState } from "react";
import { FaBook, FaCalendar, FaExternalLinkAlt } from "react-icons/fa";

const assignments = [
  { id: 1, title: "Binary Search Tree Implementation", subject: "Data Structures", description: "Implement BST with insert, delete and traversal operations in Java.", dueDate: "2025-08-20", status: "pending", classroomLink: "https://classroom.google.com" },
  { id: 2, title: "TCP/IP Protocol Analysis", subject: "Computer Networks", description: "Analyze TCP/IP protocol using Wireshark and submit a report.", dueDate: "2025-08-18", status: "submitted", classroomLink: "https://classroom.google.com" },
  { id: 3, title: "Process Scheduling Simulation", subject: "Operating Systems", description: "Simulate FCFS, SJF and Round Robin scheduling algorithms.", dueDate: "2025-08-25", status: "pending", classroomLink: "https://classroom.google.com" },
  { id: 4, title: "ER Diagram for Library System", subject: "Database Management", description: "Design ER diagram and normalize to 3NF for a library management system.", dueDate: "2025-08-15", status: "submitted", classroomLink: "https://classroom.google.com" },
  { id: 5, title: "Software Requirements Document", subject: "Software Engineering", description: "Prepare SRS document for a hospital management system.", dueDate: "2025-08-22", status: "pending", classroomLink: "https://classroom.google.com" },
];

const ACCENT = "#f97316";

export default function Assignment() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);
  const isOverdue = (date) => new Date(date) < new Date() && true;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Assignments</h2>
        <div style={s.note}>
          <FaExternalLinkAlt style={{ marginRight: "6px" }} />
          Assignments are managed via <a href="https://classroom.google.com" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: "700" }}>Google Classroom</a>
        </div>
      </div>
      <div style={s.filters}>
        {["all", "pending", "submitted"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? assignments.length : assignments.filter(a => a.status === f).length})
          </button>
        ))}
      </div>
      {filtered.map((a) => {
        const overdue = isOverdue(a.dueDate) && a.status === "pending";
        return (
          <div key={a.id} style={s.card}>
            <div style={s.top}>
              <div style={s.icon}><FaBook /></div>
              <div style={s.info}>
                <p style={s.aTitle}>{a.title}</p>
                <p style={s.subject}>{a.subject}</p>
              </div>
              <span style={s.badge(a.status, overdue)}>
                {overdue ? "Overdue" : a.status === "submitted" ? "Submitted" : "Pending"}
              </span>
            </div>
            <p style={s.desc}>{a.description}</p>
            <div style={s.footer}>
              <span style={s.due}><FaCalendar style={{ marginRight: "4px" }} />Due: {new Date(a.dueDate).toLocaleDateString()}</span>
              <a href={a.classroomLink} target="_blank" rel="noreferrer" style={s.classroomBtn}>
                <FaExternalLinkAlt style={{ marginRight: "4px" }} /> Open in Classroom
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  note: { fontSize: "13px", color: "#6b7280", display: "flex", alignItems: "center", background: "#fff7ed", padding: "6px 12px", borderRadius: "8px", border: "1px solid #fed7aa" },
  filters: { display: "flex", gap: "8px" },
  filterBtn: (active) => ({ padding: "7px 16px", borderRadius: "20px", border: `1px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  top: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  icon: { width: "40px", height: "40px", background: "#fff7ed", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: "18px", flexShrink: 0 },
  info: { flex: 1 },
  aTitle: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  subject: { fontSize: "13px", color: "#6b7280", margin: "2px 0 0" },
  badge: (status, overdue) => ({ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: overdue ? "#fee2e2" : status === "submitted" ? "#dcfce7" : "#fef9c3", color: overdue ? "#dc2626" : status === "submitted" ? "#16a34a" : "#ca8a04", whiteSpace: "nowrap" }),
  desc: { fontSize: "13px", color: "#6b7280", marginBottom: "12px", lineHeight: 1.6 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f3f4f6" },
  due: { display: "flex", alignItems: "center", fontSize: "13px", color: "#9ca3af" },
  classroomBtn: { display: "flex", alignItems: "center", fontSize: "13px", color: ACCENT, fontWeight: "700", textDecoration: "none", background: "#fff7ed", padding: "6px 12px", borderRadius: "8px", border: "1px solid #fed7aa" },
};
