import React, { useState } from "react";

const events = [
  { date: "2025-08-01", title: "Semester 5 Begins", type: "event" },
  { date: "2025-08-15", title: "Independence Day Holiday", type: "holiday" },
  { date: "2025-08-20", title: "Internal Assessment 1", type: "exam" },
  { date: "2025-09-02", title: "Ganesh Chaturthi Holiday", type: "holiday" },
  { date: "2025-09-15", title: "Assignment Submission Deadline", type: "deadline" },
  { date: "2025-09-25", title: "Internal Assessment 2", type: "exam" },
  { date: "2025-10-02", title: "Gandhi Jayanti Holiday", type: "holiday" },
  { date: "2025-10-20", title: "Diwali Vacation Begins", type: "holiday" },
  { date: "2025-10-28", title: "Diwali Vacation Ends", type: "holiday" },
  { date: "2025-11-10", title: "Practical Examinations Begin", type: "exam" },
  { date: "2025-11-20", title: "End Semester Exam Form Deadline", type: "deadline" },
  { date: "2025-12-01", title: "End Semester Examinations Begin", type: "exam" },
  { date: "2025-12-20", title: "Semester 5 Ends", type: "event" },
];

const typeConfig = {
  holiday: { color: "#dc2626", bg: "#fee2e2", label: "Holiday" },
  exam:    { color: "#7c3aed", bg: "#ede9fe", label: "Exam" },
  event:   { color: "#0d9488", bg: "#f0fdfa", label: "Event" },
  deadline:{ color: "#f97316", bg: "#fff7ed", label: "Deadline" },
};

const ACCENT = "#f97316";

export default function AcademicCalendar() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);
  const upcoming = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 3);

  return (
    <div style={s.page}>
      <h2 style={s.title}>Academic Calendar 2025-26</h2>

      {/* Upcoming */}
      <div style={s.upcomingBox}>
        <p style={s.upcomingTitle}>📌 Upcoming Events</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {upcoming.map((e, i) => (
            <div key={i} style={{ ...s.upcomingChip, background: typeConfig[e.type].bg, color: typeConfig[e.type].color }}>
              {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} — {e.title}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        {["all", "holiday", "exam", "event", "deadline"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f, f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div style={s.list}>
        {filtered.map((e, i) => {
          const cfg = typeConfig[e.type];
          const isPast = new Date(e.date) < new Date();
          return (
            <div key={i} style={{ ...s.eventRow, opacity: isPast ? 0.6 : 1 }}>
              <div style={{ ...s.dateBadge, background: cfg.bg, color: cfg.color }}>
                <div style={{ fontSize: "18px", fontWeight: "900" }}>{new Date(e.date).getDate()}</div>
                <div style={{ fontSize: "11px", fontWeight: "600" }}>{new Date(e.date).toLocaleDateString("en-IN", { month: "short" })}</div>
              </div>
              <div style={s.eventInfo}>
                <p style={s.eventTitle}>{e.title}</p>
                <p style={s.eventDate}>{new Date(e.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <span style={{ ...s.typeBadge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  upcomingBox: { background: "#fff", borderRadius: "12px", padding: "16px 20px", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  upcomingTitle: { fontSize: "13px", fontWeight: "700", color: "#6b7280", marginBottom: "10px" },
  upcomingChip: { padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: (active, type) => { const cfg = typeConfig[type] || { color: "#4f46e5", bg: "#eef2ff" }; return { padding: "7px 16px", borderRadius: "20px", border: `1px solid ${active ? cfg.color : "#e5e7eb"}`, background: active ? cfg.color : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }; },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  eventRow: { background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  dateBadge: { width: "52px", height: "52px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: "14px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  eventDate: { fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" },
  typeBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" },
};
