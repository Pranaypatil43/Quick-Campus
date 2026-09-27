import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaDownload } from "react-icons/fa";
import { api } from "../../api";

const ACCENT = "#4f46e5";

export default function FinancePage() {
  const [feeData, setFeeData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/fees")
      .then((data) => setFeeData(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? feeData
    : feeData.filter((f) => f.status === filter || f.type?.toLowerCase() === filter);

  const totalCollected = feeData.filter((f) => f.status === "paid").reduce((s, f) => s + (f.amount || 0), 0);
  const totalPending = feeData.filter((f) => f.status === "pending").reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Finance Reports</h2>
          <p style={s.sub}>Fee collection overview</p>
        </div>
        <button style={s.exportBtn}><FaDownload style={{ marginRight: "6px" }} />Export Report</button>
      </div>

      <div style={s.statsRow}>
        {[
          { label: "Total Collected", val: `₹${totalCollected.toLocaleString()}`, color: "#16a34a" },
          { label: "Pending Amount", val: `₹${totalPending.toLocaleString()}`, color: "#dc2626" },
          { label: "Paid Students", val: feeData.filter((f) => f.status === "paid").length, color: ACCENT },
          { label: "Pending Students", val: feeData.filter((f) => f.status === "pending").length, color: "#f97316" },
        ].map((st) => (
          <div key={st.label} style={s.statCard}>
            <p style={{ ...s.statVal, color: st.color }}>{st.val}</p>
            <p style={s.statLabel}>{st.label}</p>
          </div>
        ))}
      </div>

      <div style={s.filters}>
        {["all", "paid", "pending", "academic", "hostel", "transport"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={s.card}>
        {loading ? (
          <p style={s.empty}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={s.empty}>No fee records found</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["Student", "Email", "Fee Type", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f._id || i}>
                  <td style={s.td}>{f.studentId?.name || "—"}</td>
                  <td style={s.td}>{f.studentId?.email || "—"}</td>
                  <td style={s.td}>{f.type}</td>
                  <td style={{ ...s.td, fontWeight: "700" }}>₹{(f.amount || 0).toLocaleString()}</td>
                  <td style={s.td}><span style={s.badge(f.status)}>{f.status}</span></td>
                  <td style={s.td}>{f.paidAt ? new Date(f.paidAt).toLocaleDateString("en-IN") : f.status === "paid" ? "—" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
  exportBtn: { padding: "10px 20px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "22px", fontWeight: "900", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "7px 16px", borderRadius: "20px", border: `1px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? ACCENT : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", overflowX: "auto" },
  empty: { textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f8fafc", color: "#374151", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "700", borderBottom: "2px solid #e5e7eb" },
  td: { padding: "10px 14px", borderBottom: "1px solid #f3f4f6", fontSize: "13px", color: "#374151" },
  badge: (s) => ({ padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: s === "paid" ? "#dcfce7" : "#fef9c3", color: s === "paid" ? "#16a34a" : "#ca8a04" }),
};
