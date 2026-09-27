import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaEye, FaCopy } from "react-icons/fa";

const s = {
  page: { padding: "24px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#003566", marginBottom: "4px" },
  sub: { fontSize: "14px", color: "#666", marginBottom: "24px" },
  filters: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "8px 18px", borderRadius: "20px", border: `2px solid #003566`, background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#003566", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  th: { background: "#003566", color: "#ffc300", padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "700" },
  td: { padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", color: "#333" },
  badge: (status) => ({ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: status === "approved" ? "#dcfce7" : status === "rejected" ? "#fee2e2" : "#fef9c3", color: status === "approved" ? "#16a34a" : status === "rejected" ? "#dc2626" : "#ca8a04" }),
  approveBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" },
  rejectBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" },
  viewBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#003566", color: "#ffc300", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  modalTitle: { fontSize: "18px", fontWeight: "800", color: "#003566", marginBottom: "16px" },
  credBox: { background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "16px", marginTop: "16px" },
  credTitle: { fontSize: "13px", fontWeight: "700", color: "#0369a1", marginBottom: "8px" },
  credRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  credLabel: { fontSize: "13px", color: "#555" },
  credValue: { fontSize: "13px", fontWeight: "700", color: "#003566" },
  copyBtn: { background: "none", border: "none", cursor: "pointer", color: "#003566", fontSize: "14px" },
  closeBtn: { width: "100%", padding: "10px", background: "#003566", color: "#ffc300", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", marginTop: "16px" },
  empty: { textAlign: "center", padding: "40px", color: "#999" },
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [whatsappLinks, setWhatsappLinks] = useState({});

  const token = localStorage.getItem("token");

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admission/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmissions(data);
    } catch {
      console.error("Failed to fetch admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmissions(); }, []);

  const approve = async (id) => {
    setActionLoading(id + "approve");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admission/approve/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        fetchAdmissions();
        if (data.studentWhatsApp || data.parentWhatsApp) {
          setWhatsappLinks({ student: data.studentWhatsApp, parent: data.parentWhatsApp, id });
        }
      }
      else alert(data.message);
    } finally {
      setActionLoading("");
    }
  };

  const reject = async (id) => {
    setActionLoading(id + "reject");
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admission/reject/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmissions();
    } finally {
      setActionLoading("");
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  const filtered = filter === "all" ? admissions : admissions.filter((a) => a.status === filter);

  return (
    <div style={s.page}>
      <div style={s.title}>Admission Applications</div>
      <div style={s.sub}>Review and approve/reject student & staff applications</div>

      <div style={s.filters}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === "all" ? `(${admissions.length})` : `(${admissions.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.empty}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>No applications found</div>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Name</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Branch/Dept</th>
              <th style={s.th}>Applied On</th>
              <th style={s.th}>Payment</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a._id}>
                <td style={s.td}>{a.fullName}</td>
                <td style={s.td}>{a.email}</td>
                <td style={{ ...s.td, textTransform: "capitalize" }}>{a.role}</td>
                <td style={s.td}>{a.branch || a.department || "-"}</td>
                <td style={s.td}>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td style={s.td}>
                  <span style={s.badge(a.paymentStatus === "paid" ? "approved" : "rejected")}>
                    {a.paymentStatus === "paid" ? `✓ ₹${a.paymentAmount?.toLocaleString()}` : "Unpaid"}
                  </span>
                </td>
                <td style={s.td}><span style={s.badge(a.status)}>{a.status}</span></td>
                <td style={s.td}>
                  {a.status === "pending" && (
                    <>
                      <button style={s.approveBtn} onClick={() => approve(a._id)} disabled={actionLoading === a._id + "approve"}>
                        <FaCheck /> Approve
                      </button>
                      <button style={s.rejectBtn} onClick={() => reject(a._id)} disabled={actionLoading === a._id + "reject"}>
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  <button style={s.viewBtn} onClick={() => setSelected(a)}>
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={s.modal} onClick={() => setSelected(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>Application Details</div>
            <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.8" }}>
              <b>Name:</b> {selected.fullName}<br />
              <b>Email:</b> {selected.email}<br />
              <b>Phone:</b> {selected.phone}<br />
              <b>DOB:</b> {new Date(selected.dob).toLocaleDateString()}<br />
              <b>Gender:</b> {selected.gender}<br />
              <b>Role:</b> {selected.role}<br />
              {selected.branch && <><b>Branch:</b> {selected.branch}<br /></>}
              {selected.department && <><b>Department:</b> {selected.department}<br /></>}
              {selected.designation && <><b>Designation:</b> {selected.designation}<br /></>}
              {selected.parentName && <><b>Parent Name:</b> {selected.parentName}<br /></>}
              {selected.parentEmail && <><b>Parent Email:</b> {selected.parentEmail}<br /></>}
              {selected.parentPhone && <><b>Parent Phone:</b> {selected.parentPhone}<br /></>}
              <b>Documents:</b> {selected.documents?.map(d => d.name).join(", ") || "None"}<br />
              <b>Payment:</b> {selected.paymentStatus === "paid" ? `✓ Paid ₹${selected.paymentAmount?.toLocaleString()} via ${selected.paymentMethod?.toUpperCase()}` : "Unpaid"}<br />
              {selected.transactionId && <><b>Transaction ID:</b> {selected.transactionId}<br /></>}
            </div>

            {selected.status === "approved" && selected.generatedEmail && (
              <div style={s.credBox}>
                <div style={s.credTitle}>🔑 Generated Login Credentials</div>
                <div style={s.credRow}>
                  <span style={s.credLabel}>Email:</span>
                  <span style={s.credValue}>{selected.generatedEmail}</span>
                  <button style={s.copyBtn} onClick={() => copy(selected.generatedEmail)}><FaCopy /></button>
                </div>
                <div style={s.credRow}>
                  <span style={s.credLabel}>Password:</span>
                  <span style={s.credValue}>{selected.generatedPassword}</span>
                  <button style={s.copyBtn} onClick={() => copy(selected.generatedPassword)}><FaCopy /></button>
                </div>
              </div>
            )}

            {selected.status === "pending" && (
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button style={{ ...s.approveBtn, flex: 1, padding: "10px" }} onClick={() => { approve(selected._id); setSelected(null); }}>✓ Approve</button>
                <button style={{ ...s.rejectBtn, flex: 1, padding: "10px" }} onClick={() => { reject(selected._id); setSelected(null); }}>✗ Reject</button>
              </div>
            )}

            <button style={s.closeBtn} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {/* WhatsApp Notification Popup */}
      {whatsappLinks.id && (
        <div style={s.modal} onClick={() => setWhatsappLinks({})}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>✅ Admission Approved!</div>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
              Emails have been sent automatically. Click below to also send WhatsApp messages:
            </p>
            {whatsappLinks.student && (
              <a href={whatsappLinks.student} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#25D366", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "700", marginBottom: "10px", fontSize: "14px" }}>
                📱 Send WhatsApp to Student
              </a>
            )}
            {whatsappLinks.parent && (
              <a href={whatsappLinks.parent} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", background: "#128C7E", color: "#fff", borderRadius: "8px", textDecoration: "none", fontWeight: "700", marginBottom: "10px", fontSize: "14px" }}>
                📱 Send WhatsApp to Parent
              </a>
            )}
            <button style={s.closeBtn} onClick={() => setWhatsappLinks({})}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
