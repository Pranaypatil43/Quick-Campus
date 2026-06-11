import React, { useState } from "react";
import { FaSearch, FaUserGraduate } from "react-icons/fa";

const ACCENT = "#0d9488";

const students = [
  { id: 1, name: "Pranay Patil", roll: "SE-CS-001", branch: "Computer Science", sem: "Sem 5", attendance: "90%", cgpa: "8.5", phone: "9876543210", email: "pranay@university.edu" },
  { id: 2, name: "Rahul Sharma", roll: "SE-CS-002", branch: "Computer Science", sem: "Sem 5", attendance: "78%", cgpa: "7.2", phone: "9876543211", email: "rahul@university.edu" },
  { id: 3, name: "Priya Mehta", roll: "SE-CS-003", branch: "Computer Science", sem: "Sem 5", attendance: "95%", cgpa: "9.1", phone: "9876543212", email: "priya@university.edu" },
  { id: 4, name: "Amit Joshi", roll: "SE-CS-004", branch: "Computer Science", sem: "Sem 5", attendance: "65%", cgpa: "6.0", phone: "9876543213", email: "amit@university.edu" },
  { id: 5, name: "Sneha Kulkarni", roll: "SE-CS-005", branch: "Computer Science", sem: "Sem 5", attendance: "88%", cgpa: "8.0", phone: "9876543214", email: "sneha@university.edu" },
  { id: 6, name: "Rohan Desai", roll: "SE-CS-006", branch: "Computer Science", sem: "Sem 5", attendance: "72%", cgpa: "7.0", phone: "9876543215", email: "rohan@university.edu" },
  { id: 7, name: "Pooja Patil", roll: "SE-CS-007", branch: "Computer Science", sem: "Sem 5", attendance: "85%", cgpa: "7.8", phone: "9876543216", email: "pooja@university.edu" },
  { id: 8, name: "Vikram Singh", roll: "SE-CS-008", branch: "Computer Science", sem: "Sem 5", attendance: "80%", cgpa: "7.5", phone: "9876543217", email: "vikram@university.edu" },
];

export default function StudentLookupPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.roll.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={s.page}>
      <h2 style={s.title}>Student Lookup</h2>
      <div style={s.searchBox}>
        <FaSearch style={s.searchIcon} />
        <input style={s.searchInput} placeholder="Search by name or roll number..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <p style={s.count}>{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>

      <div style={s.list}>
        {filtered.map((st) => (
          <div key={st.id} style={s.card} onClick={() => setSelected(selected?.id === st.id ? null : st)}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{st.name.charAt(0)}</div>
              <div style={s.info}>
                <p style={s.name}>{st.name}</p>
                <p style={s.meta}>{st.roll} · {st.branch} · {st.sem}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={s.chip(Number(st.attendance) >= 75 ? "#dcfce7" : "#fee2e2", Number(st.attendance) >= 75 ? "#16a34a" : "#dc2626")}>{st.attendance}</span>
                <span style={s.chip("#eef2ff", "#4f46e5")}>CGPA {st.cgpa}</span>
              </div>
            </div>
            {selected?.id === st.id && (
              <div style={s.details}>
                <div style={s.detailGrid}>
                  {[["Email", st.email], ["Phone", st.phone], ["Attendance", st.attendance], ["CGPA", st.cgpa]].map(([k, v]) => (
                    <div key={k} style={s.detailField}>
                      <span style={s.detailLabel}>{k}</span>
                      <span style={s.detailVal}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "14px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  searchBox: { display: "flex", alignItems: "center", background: "#fff", border: "2px solid #e5e7eb", borderRadius: "12px", padding: "10px 16px", gap: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  searchIcon: { color: "#9ca3af", fontSize: "16px", flexShrink: 0 },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#1e1b4b", background: "transparent" },
  count: { fontSize: "13px", color: "#6b7280", margin: 0 },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "#fff", borderRadius: "12px", padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", cursor: "pointer", transition: "border-color 0.2s" },
  cardTop: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: `${ACCENT}20`, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: "14px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  meta: { fontSize: "12px", color: "#6b7280", margin: "2px 0 0" },
  chip: (bg, color) => ({ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: bg, color, whiteSpace: "nowrap" }),
  details: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  detailField: { display: "flex", flexDirection: "column", gap: "2px" },
  detailLabel: { fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" },
  detailVal: { fontSize: "13px", color: "#374151", fontWeight: "500" },
};
