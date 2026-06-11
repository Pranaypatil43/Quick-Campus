import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaDownload, FaFilter, FaCheckCircle, FaClock } from "react-icons/fa";

const ACCENT = "#f97316";

const STATIC_ALL = [
  { _id: "ac001", type: "academic", label: "Academic Fee", semester: "Semester 5 (2025-26)", amount: 60000, dueDate: "2025-09-30", status: "pending", paidAt: null },
  { _id: "ac002", type: "academic", label: "Academic Fee", semester: "Semester 4 (2024-25)", amount: 60000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-15" },
  { _id: "ac003", type: "academic", label: "Academic Fee", semester: "Semester 3 (2024-25)", amount: 58000, dueDate: "2024-08-31", status: "paid", paidAt: "2024-08-20" },
  { _id: "ho001", type: "hostel", label: "Hostel Fee", semester: "Semester 5 (2025-26)", amount: 24000, dueDate: "2025-09-30", status: "pending", paidAt: null },
  { _id: "ho002", type: "hostel", label: "Hostel Fee", semester: "Semester 4 (2024-25)", amount: 24000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-10" },
  { _id: "tr001", type: "transport", label: "Transport Fee", semester: "Semester 5 (2025-26)", amount: 8000, dueDate: "2025-09-30", status: "pending", paidAt: null },
  { _id: "tr002", type: "transport", label: "Transport Fee", semester: "Semester 4 (2024-25)", amount: 8000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-12" },
];

const typeColor = { academic: "#4f46e5", hostel: "#0d9488", transport: "#f97316" };
const typeBg = { academic: "#eef2ff", hostel: "#f0fdfa", transport: "#fff7ed" };

export default function PaymentHistory() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/student/fees").then((data) => {
      setFees(Array.isArray(data) && data.length > 0 ? data : STATIC_ALL);
      setLoading(false);
    }).catch(() => { setFees(STATIC_ALL); setLoading(false); });
  }, []);

  const downloadReceipt = (fee) => {
    const content = `
QUICKCAMPUS — PAYMENT RECEIPT
==================================
Receipt No   : RCP-${fee._id.slice(-6).toUpperCase()}
Date         : ${fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "-"}
Student      : ${localStorage.getItem("name") || "Student"}
Fee Type     : ${fee.type?.toUpperCase()}
Semester     : ${fee.semester || "-"}
Amount Paid  : Rs.${fee.amount?.toLocaleString()}
Status       : PAID
==================================
Thank you for your payment.
QuickCampus ERP System
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `receipt-${fee._id.slice(-6)}.txt`;
    a.click();
  };

  if (loading) return <div style={s.loading}>Loading...</div>;

  const paid = fees.filter((f) => f.status === "paid");
  const pending = fees.filter((f) => f.status === "pending");
  const totalPaid = paid.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPending = pending.reduce((sum, f) => sum + (f.amount || 0), 0);

  const filtered = filter === "all" ? fees
    : filter === "paid" || filter === "pending" ? fees.filter((f) => f.status === filter)
    : fees.filter((f) => f.type === filter);

  return (
    <div style={s.page}>
      <h2 style={s.title}>Payment History</h2>

      {/* Stats */}
      <div style={s.stats}>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: "#16a34a" }}>₹{totalPaid.toLocaleString()}</p>
          <p style={s.statLabel}>Total Paid</p>
        </div>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: "#dc2626" }}>₹{totalPending.toLocaleString()}</p>
          <p style={s.statLabel}>Total Pending</p>
        </div>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: "#4f46e5" }}>{paid.length}</p>
          <p style={s.statLabel}>Payments Done</p>
        </div>
        <div style={s.stat}>
          <p style={{ ...s.statVal, color: ACCENT }}>{pending.length}</p>
          <p style={s.statLabel}>Pending</p>
        </div>
      </div>

      {/* Fee Type Summary */}
      <div style={s.summaryRow}>
        {["academic", "hostel", "transport"].map((type) => {
          const typeFees = fees.filter((f) => f.type === type);
          const typePaid = typeFees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);
          const typePending = typeFees.filter((f) => f.status === "pending").reduce((s, f) => s + f.amount, 0);
          return (
            <div key={type} style={{ ...s.summaryCard, borderTop: `3px solid ${typeColor[type]}` }}>
              <p style={{ ...s.summaryType, color: typeColor[type] }}>{type.charAt(0).toUpperCase() + type.slice(1)} Fee</p>
              <div style={s.summaryRow2}>
                <div><p style={{ ...s.summaryVal, color: "#16a34a" }}>₹{typePaid.toLocaleString()}</p><p style={s.summaryLabel}>Paid</p></div>
                <div><p style={{ ...s.summaryVal, color: "#dc2626" }}>₹{typePending.toLocaleString()}</p><p style={s.summaryLabel}>Pending</p></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <FaFilter style={{ color: ACCENT, flexShrink: 0 }} />
        {["all", "academic", "hostel", "transport", "paid", "pending"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f, f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={s.empty}>No records found.</div>
      ) : (
        <div style={s.card}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Fee Type", "Semester", "Amount", "Due Date", "Paid On", "Status", "Receipt"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fee, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={s.td}>
                    <span style={{ ...s.typeBadge, background: typeBg[fee.type], color: typeColor[fee.type] }}>
                      {fee.type}
                    </span>
                  </td>
                  <td style={s.td}>{fee.semester || "-"}</td>
                  <td style={{ ...s.td, fontWeight: "800", color: "#1e1b4b" }}>₹{fee.amount?.toLocaleString()}</td>
                  <td style={s.td}>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "-"}</td>
                  <td style={s.td}>
                    {fee.paidAt ? (
                      <span style={{ color: "#16a34a", fontWeight: "600" }}>
                        <FaCheckCircle style={{ marginRight: "4px", fontSize: "11px" }} />
                        {new Date(fee.paidAt).toLocaleDateString()}
                      </span>
                    ) : <span style={{ color: "#9ca3af" }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <span style={s.badge(fee.status)}>
                      {fee.status === "paid" ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </td>
                  <td style={s.td}>
                    {fee.status === "paid" ? (
                      <button style={s.dlBtn} onClick={() => downloadReceipt(fee)} title="Download Receipt">
                        <FaDownload style={{ marginRight: "4px" }} /> Receipt
                      </button>
                    ) : <span style={{ color: "#d1d5db", fontSize: "12px" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  empty: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#9ca3af", border: "1px solid #e5e7eb" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" },
  stat: { background: "#fff", borderRadius: "12px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "20px", fontWeight: "800", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" },
  summaryCard: { background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  summaryType: { fontSize: "13px", fontWeight: "800", textTransform: "capitalize", marginBottom: "10px" },
  summaryRow2: { display: "flex", justifyContent: "space-between" },
  summaryVal: { fontSize: "16px", fontWeight: "800", margin: 0 },
  summaryLabel: { fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" },
  filters: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  filterBtn: (active, type) => {
    const color = typeColor[type] || (type === "paid" ? "#16a34a" : type === "pending" ? "#dc2626" : ACCENT);
    return { padding: "6px 14px", borderRadius: "20px", border: `1px solid ${active ? color : "#e5e7eb"}`, background: active ? color : "#fff", color: active ? "#fff" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "12px" };
  },
  card: { background: "#fff", borderRadius: "12px", padding: "0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f8fafc", color: "#374151", padding: "12px 14px", textAlign: "left", fontSize: "13px", fontWeight: "700", borderBottom: "2px solid #e5e7eb" },
  td: { padding: "12px 14px", borderBottom: "1px solid #f3f4f6", fontSize: "13px", color: "#374151" },
  typeBadge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize" },
  badge: (s) => ({ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: s === "paid" ? "#dcfce7" : "#fef9c3", color: s === "paid" ? "#16a34a" : "#ca8a04" }),
  dlBtn: { background: "#eef2ff", color: "#4f46e5", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "inline-flex", alignItems: "center" },
};
