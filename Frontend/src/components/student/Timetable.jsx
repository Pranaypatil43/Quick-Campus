import React, { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timetable = {
  Monday:    [{ time: "09:00 - 10:00", subject: "Data Structures", room: "CS-101", teacher: "Prof. Sharma" }, { time: "10:00 - 11:00", subject: "Computer Networks", room: "CS-102", teacher: "Prof. Mehta" }, { time: "11:15 - 12:15", subject: "Operating Systems", room: "CS-103", teacher: "Prof. Joshi" }, { time: "02:00 - 03:00", subject: "Web Technology Lab", room: "Lab-1", teacher: "Prof. Patil" }],
  Tuesday:   [{ time: "09:00 - 10:00", subject: "Database Management", room: "CS-101", teacher: "Prof. Kulkarni" }, { time: "10:00 - 11:00", subject: "Software Engineering", room: "CS-104", teacher: "Prof. Desai" }, { time: "02:00 - 04:00", subject: "OS Lab", room: "Lab-2", teacher: "Prof. Joshi" }],
  Wednesday: [{ time: "09:00 - 10:00", subject: "Computer Networks", room: "CS-102", teacher: "Prof. Mehta" }, { time: "10:00 - 11:00", subject: "Data Structures", room: "CS-101", teacher: "Prof. Sharma" }, { time: "11:15 - 12:15", subject: "Web Technology", room: "CS-105", teacher: "Prof. Patil" }],
  Thursday:  [{ time: "09:00 - 10:00", subject: "Software Engineering", room: "CS-104", teacher: "Prof. Desai" }, { time: "10:00 - 11:00", subject: "Database Management", room: "CS-101", teacher: "Prof. Kulkarni" }, { time: "02:00 - 04:00", subject: "DS Lab", room: "Lab-1", teacher: "Prof. Sharma" }],
  Friday:    [{ time: "09:00 - 10:00", subject: "Operating Systems", room: "CS-103", teacher: "Prof. Joshi" }, { time: "10:00 - 11:00", subject: "Web Technology", room: "CS-105", teacher: "Prof. Patil" }, { time: "11:15 - 12:15", subject: "Computer Networks", room: "CS-102", teacher: "Prof. Mehta" }],
  Saturday:  [{ time: "09:00 - 11:00", subject: "Project Work", room: "CS-106", teacher: "Prof. Guide" }],
};

const ACCENT = "#f97316";

export default function Timetable() {
  const today = DAYS[new Date().getDay() - 1] || "Monday";
  const [activeDay, setActiveDay] = useState(today);
  const slots = timetable[activeDay] || [];

  return (
    <div style={s.page}>
      <h2 style={s.title}>Timetable</h2>
      <div style={s.days}>
        {DAYS.map((d) => (
          <button key={d} style={s.dayBtn(activeDay === d)} onClick={() => setActiveDay(d)}>
            {d.slice(0, 3)}
            {d === today && <span style={s.dot} />}
          </button>
        ))}
      </div>
      {activeDay === today && <div style={s.todayBadge}>📅 Today's Schedule</div>}
      <div style={s.slots}>
        {slots.length === 0 ? (
          <div style={s.empty}>No classes on {activeDay}.</div>
        ) : (
          slots.map((slot, i) => (
            <div key={i} style={s.slot}>
              <div style={s.timeBadge}>{slot.time}</div>
              <div style={s.details}>
                <p style={s.subject}>{slot.subject}</p>
                <p style={s.meta}>Room: {slot.room} · {slot.teacher}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  days: { display: "flex", gap: "8px", flexWrap: "wrap" },
  dayBtn: (active) => ({ padding: "8px 18px", borderRadius: "20px", border: `2px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "700", cursor: "pointer", fontSize: "13px", position: "relative" }),
  dot: { position: "absolute", top: "4px", right: "4px", width: "6px", height: "6px", borderRadius: "50%", background: "#fff" },
  todayBadge: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: ACCENT, fontWeight: "600" },
  slots: { display: "flex", flexDirection: "column", gap: "10px" },
  empty: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#9ca3af" },
  slot: { background: "#fff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", display: "flex", gap: "16px", alignItems: "center" },
  timeBadge: { fontSize: "12px", fontWeight: "700", color: "#fff", background: ACCENT, padding: "6px 12px", borderRadius: "8px", whiteSpace: "nowrap" },
  details: { flex: 1 },
  subject: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  meta: { fontSize: "12px", color: "#9ca3af", margin: "3px 0 0" },
};
