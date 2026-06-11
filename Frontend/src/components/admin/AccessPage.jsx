import React, { useState } from "react";
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaSearch } from "react-icons/fa";

const ACCENT = "#4f46e5";

const users = [
  { id: 1, name: "Admin User", email: "admin@university.edu", role: "admin", status: "active", lastLogin: "2025-08-10" },
  { id: 2, name: "Prof. Sharma", email: "sharma.staff@university.edu", role: "staff", status: "active", lastLogin: "2025-08-09" },
  { id: 3, name: "Prof. Mehta", email: "mehta.staff@university.edu", role: "staff", status: "active", lastLogin: "2025-08-08" },
  { id: 4, name: "Pranay Patil", email: "pranay.student@university.edu", role: "student", status: "active", lastLogin: "2025-08-10" },
  { id: 5, name: "Rahul Sharma", email: "rahul.student@university.edu", role: "student", status: "active", lastLogin: "2025-08-07" },
  { id: 6, name: "Priya Mehta", email: "priya.student@university.edu", role: "student", status: "active", lastLogin: "2025-08-09" },
  { id: 7, name: "Amit Joshi", email: "amit.student@university.edu", role: "student", status: "inactive", lastLogin: "2025-07-20" },
];

const roleIcon = { admin: <FaUserShield />, staff: <FaChalkboardTeacher />, student: <FaUserGraduate /> };
const roleColor = { admin: "#4f46e5", staff: "#0d9488", student: "#f97316" };
const roleBg = { admin: "#eef2ff", staff: "#f0fdfa", student: "#fff7ed" };

export default function AccessPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={s.page}>
      <h2 style={s.title}>Access Control</h2>
      <p style={s.sub}>Manage system users and their access levels</p>

      <div style={s.statsRow}>
        {[
          { label: "Total Users", val: users.length, color: ACCENT },
          { label: "Admins", val: users.filter(u => u.role === "admin").length, color: "#4f46e5" },
          { label: "Staff", val: users.filter(u => u.role === "staff").length, color: "#0d9488" },
          { label: "Students", val: users.filter(u => u.role === "student").length, color: "#f97316" },
        ].map((s_) => (
          <div key={s_.label} style={s.statCard}>
            <p style={{ ...s.statVal, color: s_.color }}>{s_.val}</p>
            <p style={s.statLabel}>{s_.label}</p>
          </div>
        ))}
      </div>

      <div style={s.controls}>
        <div style={s.searchBox}>
          <FaSearch style={{ color: "#9ca3af" }} />
          <input style={s.searchInput} placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "admin", "staff", "student"].map((r) => (
            <button key={r} style={s.filterBtn(roleFilter === r)} onClick={() => setRoleFilter(r)}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>{["User", "Email", "Role", "Status", "Last Login"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: roleBg[u.role], color: roleColor[u.role], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{roleIcon[u.role]}</div>
                    {u.name}
                  </div>
                </td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}><span style={{ ...s.badge, background: roleBg[u.role], color: roleColor[u.role] }}>{u.role}</span></td>
                <td style={s.td}><span style={s.status(u.status === "active")}>{u.status}</span></td>
                <td style={s.td}>{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: 0 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "24px", fontWeight: "900", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  controls: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" },
  searchBox: { display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 14px", gap: "8px", flex: 1, minWidth: "200px" },
  searchInput: { border: "none", outline: "none", fontSize: "14px", background: "transparent", flex: 1 },
  filterBtn: (active) => ({ padding: "8px 16px", borderRadius: "20px", border: `1px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f8fafc", color: "#374151", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "700", borderBottom: "2px solid #e5e7eb" },
  td: { padding: "10px 14px", borderBottom: "1px solid #f3f4f6", fontSize: "13px", color: "#374151" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
  status: (active) => ({ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: active ? "#dcfce7" : "#f3f4f6", color: active ? "#16a34a" : "#6b7280" }),
};
