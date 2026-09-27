import React, { useState, useEffect } from "react";
import { api } from "../../api";

const ACCENT = "#f97316";

export default function Result() {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/results")
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={s.empty}>Loading results...</div>;

  if (results.length === 0)
    return (
      <div style={s.page}>
        <h2 style={s.title}>Examination Results</h2>
        <div style={s.empty}>No results available yet.</div>
      </div>
    );

  return (
    <div style={s.page}>
      <h2 style={s.title}>Examination Results</h2>
      {results.map((r, i) => {
        const total = r.subjects?.reduce((sum, sub) => sum + (sub.marks || 0), 0) || r.totalMarks || 0;
        const maxTotal = r.subjects?.reduce((sum, sub) => sum + (sub.maxMarks || 100), 0) || 0;
        return (
          <div key={r._id || i} style={s.card}>
            <div style={s.cardTop} onClick={() => setOpen(open === i ? -1 : i)}>
              <div>
                <span style={s.sem}>{r.semester}</span>
                <span style={s.badge(r.result)}>{r.result?.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={s.pct}>{r.percentage}%</span>
                <span style={{ color: "#9ca3af", fontSize: "18px" }}>{open === i ? "▲" : "▼"}</span>
              </div>
            </div>
            {open === i && r.subjects?.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <table style={s.table}>
                  <thead>
                    <tr>{["Subject", "Marks", "Max", "Grade"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {r.subjects.map((sub, j) => (
                      <tr key={j}>
                        <td style={s.td}>{sub.name}</td>
                        <td style={s.td}>{sub.marks}</td>
                        <td style={s.td}>{sub.maxMarks || 100}</td>
                        <td style={s.td}><span style={s.grade(sub.grade)}>{sub.grade || "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={s.footer}>
                  <span>Total Marks: <b>{total}{maxTotal ? `/${maxTotal}` : ""}</b></span>
                  <span>Percentage: <b>{r.percentage}%</b></span>
                </div>
              </div>
            )}
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
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  sem: { fontSize: "16px", fontWeight: "700", color: "#1e1b4b", marginRight: "12px" },
  badge: (r) => ({ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: r === "distinction" ? "#dbeafe" : r === "pass" ? "#dcfce7" : "#fee2e2", color: r === "distinction" ? "#1d4ed8" : r === "pass" ? "#16a34a" : "#dc2626" }),
  pct: { fontSize: "20px", fontWeight: "900", color: ACCENT },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "12px" },
  th: { background: "#f8fafc", color: "#374151", padding: "8px 12px", textAlign: "left", fontSize: "13px", fontWeight: "700", borderBottom: "2px solid #e5e7eb" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "13px", color: "#374151" },
  grade: (g) => ({ padding: "2px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", background: g?.startsWith("A") ? "#dcfce7" : "#fef9c3", color: g?.startsWith("A") ? "#16a34a" : "#ca8a04" }),
  footer: { display: "flex", gap: "24px", fontSize: "14px", color: "#6b7280", paddingTop: "10px", borderTop: "1px solid #f3f4f6" },
};
