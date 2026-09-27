import React, { useState } from "react";
import { FaCreditCard, FaMobileAlt, FaUniversity, FaLock } from "react-icons/fa";
import { api } from "../api";

export default function PaymentModal({ fee, onClose, onSuccess }) {
  const [method, setMethod] = useState("");
  const [form, setForm] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "", upiId: "", bank: "" });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [txnId] = useState("TXN" + Date.now());

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pay = async () => {
    if (!method) return alert("Please select a payment method");
    if (method === "card" && (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv)) return alert("Please fill all card details");
    if (method === "upi" && !form.upiId) return alert("Please enter UPI ID");
    if (method === "netbanking" && !form.bank) return alert("Please select a bank");
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (fee._id) {
      await api.put(`/student/fees/${fee._id}/pay`);
    }
    setProcessing(false);
    setDone(true);
    setTimeout(() => { onSuccess && onSuccess(); onClose(); }, 2000);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div style={s.success}>
            <div style={s.successIcon}>✓</div>
            <h3 style={s.successTitle}>Payment Successful!</h3>
            <p style={s.successSub}>₹{fee.amount?.toLocaleString()} paid successfully</p>
            <p style={s.txn}>Transaction ID: {txnId}</p>
          </div>
        ) : (
          <>
            <div style={s.header}>
              <h3 style={s.title}>Pay Fee</h3>
              <button style={s.closeBtn} onClick={onClose}>✕</button>
            </div>

            {/* Fee Summary */}
            <div style={s.feeBox}>
              <div style={s.feeRow}><span>Fee Type</span><span style={{ textTransform: "capitalize", fontWeight: "600" }}>{fee.type || fee.label}</span></div>
              {fee.semester && <div style={s.feeRow}><span>Semester</span><span>{fee.semester}</span></div>}
              {fee.dueDate && <div style={s.feeRow}><span>Due Date</span><span>{new Date(fee.dueDate).toLocaleDateString()}</span></div>}
              <div style={s.feeDivider} />
              <div style={{ ...s.feeRow, fontWeight: "800", fontSize: "17px", color: "#1e1b4b" }}>
                <span>Total Amount</span><span>₹{fee.amount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <p style={s.methodLabel}>Select Payment Method</p>
            <div style={s.methods}>
              {[{ key: "card", label: "Card", icon: <FaCreditCard /> }, { key: "upi", label: "UPI", icon: <FaMobileAlt /> }, { key: "netbanking", label: "Net Banking", icon: <FaUniversity /> }].map((m) => (
                <button key={m.key} style={s.methodBtn(method === m.key)} onClick={() => setMethod(m.key)}>
                  <span style={{ fontSize: "18px" }}>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {method === "card" && (
              <div style={s.formGrid}>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={s.label}>Card Number</label>
                  <input style={s.input} name="cardNumber" value={form.cardNumber} onChange={handle} placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={s.label}>Cardholder Name</label>
                  <input style={s.input} name="cardName" value={form.cardName} onChange={handle} placeholder="Name on card" />
                </div>
                <div>
                  <label style={s.label}>Expiry</label>
                  <input style={s.input} name="expiry" value={form.expiry} onChange={handle} placeholder="MM/YY" maxLength={5} />
                </div>
                <div>
                  <label style={s.label}>CVV</label>
                  <input style={s.input} name="cvv" type="password" value={form.cvv} onChange={handle} placeholder="•••" maxLength={3} />
                </div>
              </div>
            )}
            {method === "upi" && (
              <div>
                <label style={s.label}>UPI ID</label>
                <input style={s.input} name="upiId" value={form.upiId} onChange={handle} placeholder="yourname@upi" />
              </div>
            )}
            {method === "netbanking" && (
              <div>
                <label style={s.label}>Select Bank</label>
                <select style={s.input} name="bank" value={form.bank} onChange={handle}>
                  <option value="">Select your bank</option>
                  {["SBI", "HDFC", "ICICI", "Axis", "PNB", "Bank of Baroda", "Canara Bank", "Kotak"].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}

            <div style={s.secure}><FaLock style={{ marginRight: "6px", fontSize: "11px" }} />Secured by 256-bit SSL encryption</div>

            <button style={s.payBtn} onClick={pay} disabled={processing || !method}>
              {processing ? <><span style={s.spinner} /> Processing...</> : `Pay ₹${fee.amount?.toLocaleString()}`}
            </button>
            <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

const ACCENT = "#f97316";
const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  modal: { background: "#fff", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "18px", fontWeight: "800", color: "#1e1b4b", margin: 0 },
  closeBtn: { background: "#f3f4f6", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: "700", color: "#6b7280", fontSize: "14px" },
  feeBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "20px" },
  feeRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "8px" },
  feeDivider: { borderTop: "1px solid #e2e8f0", margin: "10px 0" },
  methodLabel: { fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "10px" },
  methods: { display: "flex", gap: "8px", marginBottom: "16px" },
  methodBtn: (active) => ({ flex: 1, padding: "10px 8px", borderRadius: "10px", border: `2px solid ${active ? ACCENT : "#e5e7eb"}`, background: active ? "#fff7ed" : "#fff", color: active ? ACCENT : "#6b7280", fontWeight: "700", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontSize: "12px", transition: "all 0.15s" }),
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "2px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  secure: { display: "flex", alignItems: "center", fontSize: "12px", color: "#9ca3af", marginBottom: "14px", marginTop: "8px" },
  payBtn: { width: "100%", padding: "13px", background: ACCENT, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "800", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  cancelBtn: { width: "100%", padding: "10px", background: "#f3f4f6", color: "#6b7280", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", marginTop: "8px" },
  spinner: { width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" },
  success: { textAlign: "center", padding: "20px 0" },
  successIcon: { width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: "28px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  successTitle: { fontSize: "20px", fontWeight: "800", color: "#1e1b4b", margin: "0 0 8px" },
  successSub: { fontSize: "14px", color: "#6b7280", margin: "0 0 8px" },
  txn: { fontSize: "12px", color: "#9ca3af", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", display: "inline-block" },
};
