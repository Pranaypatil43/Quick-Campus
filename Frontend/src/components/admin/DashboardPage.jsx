import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaMoneyBillWave, FaClock, FaBed, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ACCENT = "#4f46e5";

const stats = [
  { label: "Total Students", value: "248", icon: <FaUserGraduate />, color: "#4f46e5", bg: "#eef2ff", change: "+12 this month" },
  { label: "Total Staff", value: "32", icon: <FaChalkboardTeacher />, color: "#0d9488", bg: "#f0fdfa", change: "+2 this month" },
  { label: "Pending Admissions", value: "8", icon: <FaClipboardList />, color: "#f97316", bg: "#fff7ed", change: "Needs review" },
  { label: "Revenue Collected", value: "₹14.8L", icon: <FaMoneyBillWave />, color: "#16a34a", bg: "#dcfce7", change: "This semester" },
  { label: "Pending Fees", value: "23", icon: <FaClock />, color: "#dc2626", bg: "#fee2e2", change: "Students" },
  { label: "Hostel Occupancy", value: "87%", icon: <FaBed />, color: "#7c3aed", bg: "#ede9fe", change: "174/200 rooms" },
];

const recentAdmissions = [
  { name: "Pranay Patil", role: "Student", branch: "Computer Science", status: "approved", date: "10 Aug 2025" },
  { name: "Sneha Kulkarni", role: "Student", branch: "Mechanical", status: "pending", date: "09 Aug 2025" },
  { name: "Prof. Mehta", role: "Staff", branch: "Physics Dept", status: "approved", date: "08 Aug 2025" },
  { name: "Rohan Desai", role: "Student", branch: "Civil", status: "pending", date: "07 Aug 2025" },
  { name: "Pooja Patil", role: "Student", branch: "IT", status: "rejected", date: "06 Aug 2025" },
];

const feeStatus = [
  { type: "Academic Fee", collected: 148000, total: 200000 },
  { type: "Hostel Fee", collected: 87000, total: 100000 },
  { type: "Transport Fee", collected: 32000, total: 40000 },
];

export default function DashboardPage() {
  return (
    <div style={s.page}>
      <div>
        <h2 style={s.title}>Live Dashboard</h2>
        <p style={s.sub}>QuickCampus — Real-time overview · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stats Grid */}
      <div style={s.statsGrid}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={s.statVal(st.color)}>{st.value}</p>
                <p style={s.statLabel}>{st.label}</p>
                <p style={s.statChange}>{st.change}</p>
              </div>
              <div style={{ ...s.iconBox, background: st.bg, color: st.color }}>{st.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.row}>
        {/* Recent Admissions */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Recent Admissions</h3>
          {recentAdmissions.map((a, i) => (
            <div key={i} style={s.admRow}>
              <div style={s.admAvatar}>{a.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <p style={s.admName}>{a.name}</p>
                <p style={s.admMeta}>{a.role} · {a.branch}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={s.badge(a.status)}>{a.status}</span>
                <p style={s.admDate}>{a.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fee Collection */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Fee Collection Status</h3>
          {feeStatus.map((f) => {
            const pct = Math.round((f.collected / f.total) * 100);
            return (
              <div key={f.type} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e1b4b" }}>{f.type}</span>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>₹{f.collected.toLocaleString()} / ₹{f.total.toLocaleString()}</span>
                </div>
                <div style={s.bar}><div style={{ ...s.fill, width: `${pct}%` }} /></div>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>{pct}% collected</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { fontSize: "22px", fontWeight: "900", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: (color) => ({ fontSize: "26px", fontWeight: "900", color, margin: 0 }),
  statLabel: { fontSize: "13px", color: "#374151", fontWeight: "600", margin: "4px 0 2px" },
  statChange: { fontSize: "12px", color: "#9ca3af", margin: 0 },
  iconBox: { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  card: { background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  cardTitle: { fontSize: "15px", fontWeight: "800", color: "#1e1b4b", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` },
  admRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
  admAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#eef2ff", color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", flexShrink: 0 },
  admName: { fontSize: "13px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  admMeta: { fontSize: "12px", color: "#9ca3af", margin: 0 },
  admDate: { fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" },
  badge: (s) => ({ padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: s === "approved" ? "#dcfce7" : s === "rejected" ? "#fee2e2" : "#fef9c3", color: s === "approved" ? "#16a34a" : s === "rejected" ? "#dc2626" : "#ca8a04" }),
  bar: { height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" },
  fill: { height: "100%", background: ACCENT, borderRadius: "4px" },
};
