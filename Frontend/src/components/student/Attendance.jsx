import React, { useEffect, useState } from "react";
import { api } from "../../api";

const ACCENT = "#f97316";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/attendance")
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.empty}>Loading attendance...</div>;

  if (records.length === 0)
    return (
      <div style={s.page}>
        <h2 style={s.title}>Attendance</h2>
        <div style={s.empty}>No attendance records available yet.</div>
      </div>
    );

  // Group records by subject
  const subjectMap = {};
  records.forEach((r) => {
    if (!subjectMap[r.subject]) subjectMap[r.subject] = { present: 0, total: 0 };
    subjectMap[r.subject].total += 1;
    if (r.status === "present") subjectMap[r.subject].present += 1;
  });

  const data = Object.entries(subjectMap).map(([subject, val]) => ({ subject, ...val }));
  const totalPresent = data.reduce((s, d) => s + d.present, 0);
  const totalClasses = data.reduce((s, d) => s + d.total, 0);
  const overall = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : "0.0";

  return (
    <div style={s.page}>
      <h2 style={s.title}>Attendance</h2>
      <div style={s.stats}>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: parseFloat(overall) >= 75 ? "#16a34a" : "#dc2626" }}>{overall}%</p>
          <p style={s.statLabel}>Overall</p>
        </div>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: "#16a34a" }}>{totalPresent}</p>
          <p style={s.statLabel}>Present</p>
        </div>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: "#dc2626" }}>{totalClasses - totalPresent}</p>
          <p style={s.statLabel}>Absent</p>
        </div>
        <div style={s.stat}>
          <p style={s.statVal}>{totalClasses}</p>
          <p style={s.statLabel}>Total Classes</p>
        </div>
      </div>

      {data.map((d) => {
        const pct = d.total > 0 ? ((d.present / d.total) * 100).toFixed(1) : "0.0";
        const color = parseFloat(pct) >= 75 ? "#16a34a" : parseFloat(pct) >= 60 ? "#ca8a04" : "#dc2626";
        return (
          <div key={d.subject} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.subject}>{d.subject}</span>
              <span style={{ ...s.pct, color }}>{pct}%</span>
            </div>
            <div style={s.bar}>
              <div style={{ ...s.fill, width: `${pct}%`, background: color }} />
            </div>
            <p style={s.sub}>{d.present}/{d.total} classes attended · {d.total - d.present} absent</p>
          </div>
        );
      })}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  empty: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" },
  stat: { background: "#fff", borderRadius: "12px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "22px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  subject: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b" },
  pct: { fontSize: "15px", fontWeight: "800" },
  bar: { height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", marginBottom: "6px" },
  fill: { height: "100%", borderRadius: "4px", transition: "width 0.3s" },
  sub: { fontSize: "12px", color: "#9ca3af" },
};
