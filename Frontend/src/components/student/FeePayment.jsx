import React, { useEffect, useState } from "react";
import { api } from "../../api";
import PaymentModal from "../PaymentModal";
import { FaCheckCircle } from "react-icons/fa";

const ACCENT = "#f97316";

const STATIC_FEES = [
  { _id: null, type: "academic", label: "Academic Fee", semester: "Semester 5 (2025-26)", amount: 60000, dueDate: "2025-09-30", status: "pending" },
  { _id: null, type: "academic", label: "Academic Fee", semester: "Semester 4 (2024-25)", amount: 60000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-15" },
];

export default function FeePayment() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);

  const fetchFees = () => {
    api.get("/student/fees/academic").then((data) => {
      const list = Array.isArray(data) && data.length > 0 ? data : STATIC_FEES;
      setFees(list);
      setLoading(false);
    }).catch(() => { setFees(STATIC_FEES); setLoading(false); });
  };

  useEffect(() => { fetchFees(); }, []);

  const totalPaid = fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const totalPending = fees.filter(f => f.status === "pending").reduce((s, f) => s + f.amount, 0);

  if (loading) return <div style={s.loading}>Loading fees...</div>;

  return (
    <div style={s.page}>
      <h2 style={s.title}>Academic Fee</h2>

      <div style={s.stats}>
        <div style={s.stat}><p style={{ ...s.statVal, color: "#16a34a" }}>₹{totalPaid.toLocaleString()}</p><p style={s.statLabel}>Total Paid</p></div>
        <div style={s.stat}><p style={{ ...s.statVal, color: "#dc2626" }}>₹{totalPending.toLocaleString()}</p><p style={s.statLabel}>Pending</p></div>
        <div style={s.stat}><p style={s.statVal}>{fees.length}</p><p style={s.statLabel}>Total Records</p></div>
      </div>

      {fees.map((fee, i) => (
        <div key={i} style={{ ...s.card, borderLeft: `4px solid ${fee.status === "paid" ? "#16a34a" : ACCENT}` }}>
          <div style={s.row}>
            <div>
              <p style={s.sem}>{fee.semester || fee.label}</p>
              <p style={s.amount}>₹{fee.amount?.toLocaleString()}</p>
              <p style={s.due}>Due: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "N/A"}</p>
            </div>
            <div style={s.right}>
              <span style={s.badge(fee.status)}>{fee.status === "paid" ? "✓ Paid" : "Pending"}</span>
              {fee.status === "pending" && (
                <button style={s.payBtn} onClick={() => setPayModal(fee)}>Pay Now →</button>
              )}
              {fee.status === "paid" && (
                <p style={s.paidAt}><FaCheckCircle style={{ marginRight: "4px" }} />Paid on {new Date(fee.paidAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {payModal && (
        <PaymentModal
          fee={payModal}
          onClose={() => setPayModal(null)}
          onSuccess={() => { fetchFees(); setPayModal(null); }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" },
  stat: { background: "#fff", borderRadius: "12px", padding: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  statVal: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  statLabel: { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sem: { fontSize: "14px", color: "#6b7280", marginBottom: "4px" },
  amount: { fontSize: "30px", fontWeight: "900", color: "#1e1b4b" },
  due: { fontSize: "13px", color: "#9ca3af", marginTop: "4px" },
  right: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" },
  badge: (s) => ({ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: s === "paid" ? "#dcfce7" : "#fff7ed", color: s === "paid" ? "#16a34a" : ACCENT }),
  payBtn: { padding: "10px 24px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "800", fontSize: "14px", boxShadow: `0 4px 12px rgba(249,115,22,0.3)` },
  paidAt: { fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center" },
};
