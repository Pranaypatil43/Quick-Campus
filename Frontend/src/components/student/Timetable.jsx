import React, { useState, useEffect } from "react";
import { api } from "../../api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ACCENT = "#f97316";

export default function Timetable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = DAYS[new Date().getDay() - 1] || "Monday";
  const [activeDay, setActiveDay] = useState(today);

  useEffect(() => {
    api.get("/student/timetable")
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const slots = entries.filter((e) => e.day === activeDay);

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
        {loading ? (
          <div style={s.empty}>Loading timetable...</div>
        ) : slots.length === 0 ? (
          <div style={s.empty}>No classes on {activeDay}.</div>
        ) : (
          slots.map((slot, i) => (
            <div key={slot._id || i} style={s.slot}>
              <div style={s.timeBadge}>{slot.startTime} - {slot.endTime}</div>
              <div style={s.details}>
                <p style={s.subject}>{slot.subject}</p>
                <p style={s.meta}>
                  {slot.room ? `Room: ${slot.room}` : ""}
                  {slot.room && slot.teacher ? " · " : ""}
                  {slot.teacher || ""}
                </p>
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
  empty: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" },
  slot: { background: "#fff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", display: "flex", gap: "16px", alignItems: "center" },
  timeBadge: { fontSize: "12px", fontWeight: "700", color: "#fff", background: ACCENT, padding: "6px 12px", borderRadius: "8px", whiteSpace: "nowrap" },
  details: { flex: 1 },
  subject: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  meta: { fontSize: "12px", color: "#9ca3af", margin: "3px 0 0" },
};
