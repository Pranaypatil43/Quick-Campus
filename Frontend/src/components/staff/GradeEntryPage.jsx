import React, { useState } from "react";

const ACCENT = "#0d9488";

const subjects = ["Data Structures", "Computer Networks", "Operating Systems"];
const students = [
  { id: 1, name: "Pranay Patil", roll: "SE-CS-001", grades: { "Data Structures": 82, "Computer Networks": 75, "Operating Systems": 80 } },
  { id: 2, name: "Rahul Sharma", roll: "SE-CS-002", grades: { "Data Structures": 70, "Computer Networks": 68, "Operating Systems": 72 } },
  { id: 3, name: "Priya Mehta", roll: "SE-CS-003", grades: { "Data Structures": 90, "Computer Networks": 88, "Operating Systems": 85 } },
  { id: 4, name: "Amit Joshi", roll: "SE-CS-004", grades: { "Data Structures": 55, "Computer Networks": 60, "Operating Systems": 58 } },
  { id: 5, name: "Sneha Kulkarni", roll: "SE-CS-005", grades: { "Data Structures": 78, "Computer Networks": 82, "Operating Systems": 76 } },
  { id: 6, name: "Rohan Desai", roll: "SE-CS-006", grades: { "Data Structures": 65, "Computer Networks": 70, "Operating Systems": 68 } },
];

const getGrade = (m) => m >= 90 ? "A+" : m >= 80 ? "A" : m >= 70 ? "B+" : m >= 60 ? "B" : m >= 50 ? "C" : "F";
const getColor = (m) => m >= 75 ? "#16a34a" : m >= 50 ? "#ca8a04" : "#dc2626";

export default function GradeEntryPage() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [grades, setGrades] = useState(() => {
    const g = {};
    students.forEach((s) => g[s.id] = s.grades[selectedSubject] || "");
    return g;
  });
  const [saved, setSaved] = useState(false);

  const changeSubject = (sub) => {
    setSelectedSubject(sub);
    const g = {};
    students.forEach((s) => g[s.id] = s.grades[sub] || "");
    setGrades(g);
    setSaved(false);
  };

  const avg = Math.round(Object.values(grades).reduce((s, v) => s + (Number(v) || 0), 0) / students.length);
  const passing = Object.values(grades).filter((v) => Number(v) >= 40).length;

  return (
    <div style={s.page}>
      <h2 style={s.title}>Grade Entry</h2>

      <div style={s.filters}>
        {subjects.map((sub) => (
          <button key={sub} style={s.filterBtn(selectedSubject === sub)} onClick={() => changeSubject(sub)}>{sub}</button>
        ))}
      </div>

      <div style={s.statsRow}>
        {[{ label: "Class Average", val: `${avg}%`, color: ACCENT }, { label: "Passing", val: `${passing}/${students.length}`, color: "#16a34a" }, { label: "Failing", val: `${students.length - passing}/${students.length}`, color: "#dc2626" }].map((s_) => (
          <div key={s_.label} style={s.statCard}>
            <p style={{ ...s.statVal, color: s_.color }}>{s_.val}</p>
            <p style={s.statLabel}>{s_.label}</p>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <h3 style={s.cardTitle}>{selectedSubject} — SE-CS-A</h3>
        <table style={s.table}>
          <thead>
            <tr>{["Roll No", "Student Name", "Marks (/100)", "Grade", "Status"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {students.map((st) => {
              const mark = Number(grades[st.id]) || 0;
              return (
                <tr key={st.id}>
                  <td style={s.td}>{st.roll}</td>
                  <td style={s.td}>{st.name}</td>
                  <td style={s.td}>
                    <input type="number" min="0" max="100" value={grades[st.id]} onChange={(e) => setGrades({ ...grades, [st.id]: e.target.value })}
                      style={s.input} />
                  </td>
                  <td style={s.td}><span style={s.grade(mark)}>{getGrade(mark)}</span></td>
                  <td style={s.td}><span style={s.status(mark >= 40)}>{mark >= 40 ? "Pass" : "Fail"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button style={s.saveBtn} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "✓ Grades Saved!" : "Save Grades"}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "8px 18px", borderRadius: "20px", border: `1px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "24px", fontWeight: "900", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTitle: { fontSize: "15px", fontWeight: "800", color: "#1e1b4b", marginBottom: "16px" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "16px" },
  th: { background: "#f8fafc", color: "#374151", padding: "10px 12px", textAlign: "left", fontSize: "13px", fontWeight: "700", borderBottom: "2px solid #e5e7eb" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "13px" },
  input: { width: "70px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center" },
  grade: (m) => ({ padding: "3px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", background: m >= 75 ? "#dcfce7" : m >= 50 ? "#fef9c3" : "#fee2e2", color: m >= 75 ? "#16a34a" : m >= 50 ? "#ca8a04" : "#dc2626" }),
  status: (pass) => ({ padding: "3px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", background: pass ? "#dcfce7" : "#fee2e2", color: pass ? "#16a34a" : "#dc2626" }),
  saveBtn: { padding: "11px 28px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
};
