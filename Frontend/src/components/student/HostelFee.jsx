import React, { useEffect, useState } from "react";
import { api } from "../../api";
import PaymentModal from "../PaymentModal";
import { FaCheckCircle, FaBed } from "react-icons/fa";

const ACCENT = "#f97316";

const STATIC_FEES = [
  { _id: null, type: "hostel", label: "Hostel Fee", semester: "Semester 5 (2025-26)", amount: 24000, dueDate: "2025-09-30", status: "pending", paidAt: null },
  { _id: null, type: "hostel", label: "Hostel Fee", semester: "Semester 4 (2024-25)", amount: 24000, dueDate: "2025-02-28", status: "paid", paidAt: "2025-02-10" },
];

const STATIC_HOSTEL = { roomNumber: "204", block: "Block A", type: "Double Sharing", monthlyFee: 4000, status: "active" };

export default function HostelFee() {
  const [fees, setFees] = useState([]);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(null);
  const [opted, setOpted] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get("/student/fees/hostel").catch(() => []),
      api.get("/student/hostel").catch(() => null),
      api.get("/student/profile").catch(() => null),
    ]).then(([f, h, profile]) => {
      const hostelOpted = profile?.hostelRequired !== false;
      setOpted(hostelOpted);
      setFees(Array.isArray(f) && f.length > 0 ? f : hostelOpted ? STATIC_FEES : []);
      setHostel(h?._id ? h : hostelOpted ? STATIC_HOSTEL : null);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div style={s.loading}>Loading...</div>;

  if (!opted) return (
    <div style={s.page}>
      <h2 style={s.title}>Hostel Fee</h2>
      <div style={s.notOpted}>
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>🏠</p>
        <p style={{ fontWeight: "700", color: "#1e1b4b", fontSize: "16px", marginBottom: "6px" }}>Hostel Not Opted</p>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>You did not opt for hostel during admission.<br />Contact admin to add this service.</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <h2 style={s.title}>Hostel Fee</h2>

      {hostel && (
        <div style={s.hostelCard}>
          <div style={s.hostelIcon}><FaBed style={{ fontSize: "24px", color: ACCENT }} /></div>
          <div style={s.hostelInfo}>
            <p style={s.hostelTitle}>Room {hostel.roomNumber} · {hostel.block}</p>
            <p style={s.hostelMeta}>{hostel.type || hostel.hostelPreference} · ₹{hostel.monthlyFee?.toLocaleString()}/month</p>
          </div>
          <span style={s.activeBadge}>Active</span>
        </div>
      )}

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

      {payModal && <PaymentModal fee={payModal} onClose={() => setPayModal(null)} onSuccess={() => { fetchData(); setPayModal(null); }} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  title: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b" },
  notOpted: { background: "#fff", borderRadius: "16px", padding: "48px 24px", textAlign: "center", border: "1px solid #e5e7eb" },
  hostelCard: { background: "#fff7ed", borderRadius: "12px", padding: "16px 20px", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "14px" },
  hostelIcon: { width: "48px", height: "48px", background: "#fff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  hostelInfo: { flex: 1 },
  hostelTitle: { fontSize: "15px", fontWeight: "700", color: "#1e1b4b", margin: 0 },
  hostelMeta: { fontSize: "13px", color: "#6b7280", margin: "2px 0 0" },
  activeBadge: { background: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
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
