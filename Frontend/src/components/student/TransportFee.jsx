import React, { useEffect, useState } from "react";
import { api } from "../../api";
import PaymentModal from "../PaymentModal";
import { FaCheckCircle, FaBus } from "react-icons/fa";

const ACCENT = "#f97316";

const STATIC_FEES = [
  { _id: null, type: "transport", label: "Transport Fee", semester: "Semester 5 (2025-26)", amount: 8000, dueDate: "2025-09-30", status: "pending", paidAt: null },
  { _id: null, type: "transport", label: "Transport Fee", semester: "Semester 4 (2024-25)", amount: 8000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-12" },
];

export default function TransportFee() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [opted, setOpted] = useState(true);
  const [route, setRoute] = useState("");

  const fetchFees = () => {
    Promise.all([
      api.get("/student/fees/transport").catch(() => []),
      api.get("/student/profile").catch(() => null),
    ]).then(([data, profile]) => {
      const transportOpted = profile?.transportRequired !== false;
      setOpted(transportOpted);
      setRoute(profile?.admission?.transportRoute || "Route 3 — Jalgaon to Campus");
      setFees(Array.isArray(data) && data.length > 0 ? data : transportOpted ? STATIC_FEES : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchFees(); }, []);

  if (loading) return <div style={s.loading}>Loading...</div>;

  if (!opted) return (
    <div style={s.page}>
      <h2 style={s.title}>Transport Fee</h2>
      <div style={s.notOpted}>
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>🚌</p>
        <p style={{ fontWeight: "700", color: "#1e1b4b", fontSize: "16px", marginBottom: "6px" }}>Transport Not Opted</p>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>You did not opt for transport during admission.<br />Contact admin to add this service.</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <h2 style={s.title}>Transport Fee</h2>

      <div style={s.routeCard}>
        <div style={s.routeIcon}><FaBus style={{ fontSize: "22px", color: ACCENT }} /></div>
        <div style={s.routeInfo}>
          <p style={s.routeTitle}>{route}</p>
          <p style={s.routeMeta}>Pickup: 7:30 AM · Bus: MH-19-AB-1234</p>
        </div>
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
              {fee.status === "pending" && <button style={s.payBtn} onClick={() => setPayModal(fee)}>Pay Now →</button>}
              {fee.status === "paid" && <p style={s.paidAt}><FaCheckCircle style={{ marginRight: "4px" }} />Paid on {new Date(fee.paidAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      ))}

      {payModal && <PaymentModal fee={payModal} onClose={() => setPayModal(null)} onSuccess={() => { fetchFees(); setPayModal(null); }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  notOpted: { background: "#fff", borderRadius: "16px", padding: "48px 24px", textAlign: "center", border: "1px solid #e5e7eb" },
  routeCard: { background: "#fff7ed", borderRadius: "12px", padding: "16px 20px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "14px" },
  routeIcon: { width: "48px", height: "48px", background: "#fff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  routeInfo: { flex: 1 },
  routeTitle: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  routeMeta: { fontSize: "13px", color: "#6b7280", margin: "2px 0 0" },
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
