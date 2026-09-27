import React, { useEffect, useState } from "react";
import { FaBed, FaTimes, FaEye, FaThLarge, FaList } from "react-icons/fa";

const token = () => localStorage.getItem("token");
const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

// Build room grid from allotted requests
function buildRoomGrid(requests) {
  const rooms = {};
  requests.forEach((r) => {
    if (r.hostelStatus === "allotted" && r.allottedBlock && r.allottedRoom) {
      const key = `${r.allottedBlock}-${r.allottedRoom}`;
      if (!rooms[key]) rooms[key] = { block: r.allottedBlock, room: r.allottedRoom, occupants: [], type: r.hostelPreference || "single" };
      rooms[key].occupants.push(r);
    }
  });
  return rooms;
}

const capacity = { single: 1, double: 2, triple: 3 };

export default function HostelPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [allotModal, setAllotModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [room, setRoom] = useState({ roomNumber: "", block: "" });
  const [saving, setSaving] = useState(false);
  const [activeBlock, setActiveBlock] = useState("all");

  const fetch_ = () => {
    fetch(`${BASE}/admission/hostel-requests`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setRequests(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(() => { fetch_(); }, []);

  const allot = async () => {
    if (!room.roomNumber || !room.block) return alert("Enter room number and block");
    setSaving(true);
    await fetch(`${BASE}/admission/allot-hostel/${allotModal._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(room),
    });
    setAllotModal(null);
    setRoom({ roomNumber: "", block: "" });
    setSaving(false);
    fetch_();
  };

  const reject = async (id) => {
    if (!confirm("Reject this hostel request?")) return;
    await fetch(`${BASE}/admission/reject-hostel/${id}`, { method: "POST", headers: { Authorization: `Bearer ${token()}` } });
    fetch_();
  };

  const roomGrid = buildRoomGrid(requests);
  const blocks = ["all", ...new Set(Object.values(roomGrid).map((r) => r.block))];
  const filteredRooms = Object.values(roomGrid).filter((r) => activeBlock === "all" || r.block === activeBlock);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.hostelStatus === filter);
  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.hostelStatus === "pending").length,
    allotted: requests.filter((r) => r.hostelStatus === "allotted").length,
    rejected: requests.filter((r) => r.hostelStatus === "rejected").length,
  };

  return (
    <div style={s.page}>
      <div><h2 style={s.title}>Hostel Management</h2><p style={s.sub}>Visual room grid & hostel request management</p></div>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { label: "Total Requests", val: counts.total, color: "#003566" },
          { label: "Pending", val: counts.pending, color: "#ca8a04" },
          { label: "Allotted", val: counts.allotted, color: "#16a34a" },
          { label: "Rejected", val: counts.rejected, color: "#dc2626" },
          { label: "Rooms Occupied", val: Object.keys(roomGrid).length, color: "#7c3aed" },
        ].map((s_) => (
          <div key={s_.label} style={s.stat}>
            <p style={{ fontSize: "26px", fontWeight: "800", color: s_.color, margin: 0 }}>{s_.val}</p>
            <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>{s_.label}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div style={s.viewToggle}>
        <button style={s.toggleBtn(view === "grid")} onClick={() => setView("grid")}><FaThLarge /> Room Grid</button>
        <button style={s.toggleBtn(view === "list")} onClick={() => setView("list")}><FaList /> Request List</button>
      </div>

      {/* ROOM GRID VIEW */}
      {view === "grid" && (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.sectionTitle}>🏠 Room Occupancy Map</div>
            <div style={s.legend}>
              <span style={s.dot("#16a34a")} /> Occupied
              <span style={{ ...s.dot("#e5e7eb"), marginLeft: "12px" }} /> Vacant
              <span style={{ ...s.dot("#ffc300"), marginLeft: "12px" }} /> Partial
            </div>
          </div>

          {/* Block filter */}
          <div style={s.filters}>
            {blocks.map((b) => (
              <button key={b} style={s.filterBtn(activeBlock === b)} onClick={() => setActiveBlock(b)}>
                {b === "all" ? "All Blocks" : b}
              </button>
            ))}
          </div>

          {filteredRooms.length === 0 ? (
            <div style={s.empty}>No rooms allotted yet. Approve hostel requests to see rooms here.</div>
          ) : (
            <div style={s.roomGrid}>
              {filteredRooms.map((rm) => {
                const cap = capacity[rm.type] || 1;
                const occ = rm.occupants.length;
                const isFull = occ >= cap;
                const isEmpty = occ === 0;
                const color = isFull ? "#16a34a" : isEmpty ? "#e5e7eb" : "#ffc300";
                const textColor = isFull ? "#fff" : isEmpty ? "#999" : "#003566";
                return (
                  <div
                    key={`${rm.block}-${rm.room}`}
                    style={s.roomBox(color, textColor)}
                    onClick={() => setViewModal({ type: "room", data: rm })}
                    title={`${rm.block} - Room ${rm.room}\n${occ}/${cap} occupied`}
                  >
                    <FaBed style={{ fontSize: "20px", marginBottom: "4px" }} />
                    <div style={{ fontSize: "13px", fontWeight: "800" }}>Room {rm.room}</div>
                    <div style={{ fontSize: "11px", opacity: 0.85 }}>{rm.block}</div>
                    <div style={{ fontSize: "11px", marginTop: "4px", fontWeight: "700" }}>
                      {occ}/{cap} {isFull ? "Full" : isEmpty ? "Vacant" : "Partial"}
                    </div>
                    {/* Bed dots */}
                    <div style={{ display: "flex", gap: "4px", marginTop: "6px", justifyContent: "center" }}>
                      {Array.from({ length: cap }).map((_, i) => (
                        <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i < occ ? (isFull ? "#fff" : "#003566") : "rgba(0,0,0,0.2)" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div style={s.card}>
          <div style={s.sectionTitle}>Hostel Requests</div>
          <div style={s.filters}>
            {["all", "pending", "allotted", "rejected"].map((f) => (
              <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({f === "all" ? counts.total : counts[f] || 0})
              </button>
            ))}
          </div>
          {loading ? <div style={s.empty}>Loading...</div> : filtered.length === 0 ? (
            <div style={s.empty}>No requests found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>{["Student", "Branch", "Preference", "Status", "Room", "Actions"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r._id}>
                      <td style={s.td}>
                        <div style={{ fontWeight: "600" }}>{r.fullName}</div>
                        <div style={{ fontSize: "12px", color: "#999" }}>{r.email}</div>
                      </td>
                      <td style={s.td}>{r.branch || "-"}</td>
                      <td style={s.td}>{r.hostelPreference ? <span style={s.prefBadge}>{r.hostelPreference}</span> : "-"}</td>
                      <td style={s.td}><span style={s.badge(r.hostelStatus)}>{r.hostelStatus?.replace("_", " ")}</span></td>
                      <td style={s.td}>{r.hostelStatus === "allotted" ? `${r.allottedBlock} - ${r.allottedRoom}` : "-"}</td>
                      <td style={s.td}>
                        {r.hostelStatus === "pending" && (
                          <>
                            <button style={s.allotBtn} onClick={() => setAllotModal(r)}><FaBed /> Allot</button>
                            <button style={s.rejectBtn} onClick={() => reject(r._id)}><FaTimes /></button>
                          </>
                        )}
                        <button style={s.viewBtn} onClick={() => setViewModal({ type: "student", data: r })}><FaEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Allot Modal */}
      {allotModal && (
        <div style={s.modal} onClick={() => setAllotModal(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>🏠 Allot Hostel Room</div>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
              Student: <b>{allotModal.fullName}</b><br />
              Preference: <b>{allotModal.hostelPreference || "Any"}</b>
            </p>
            <label style={s.label}>Block Name</label>
            <input style={s.input} placeholder="e.g. Block A" value={room.block} onChange={(e) => setRoom({ ...room, block: e.target.value })} />
            <label style={s.label}>Room Number</label>
            <input style={s.input} placeholder="e.g. 101" value={room.roomNumber} onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })} />
            <button style={s.confirmBtn} onClick={allot} disabled={saving}>{saving ? "Allotting..." : "✓ Confirm Allotment"}</button>
            <button style={s.cancelBtn} onClick={() => setAllotModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <div style={s.modal} onClick={() => setViewModal(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            {viewModal.type === "room" ? (
              <>
                <div style={s.modalTitle}>🛏 {viewModal.data.block} — Room {viewModal.data.room}</div>
                <div style={{ marginBottom: "12px" }}>
                  <span style={s.prefBadge}>{viewModal.data.type} room</span>
                  <span style={{ marginLeft: "8px", fontSize: "13px", color: "#555" }}>
                    {viewModal.data.occupants.length}/{capacity[viewModal.data.type] || 1} occupied
                  </span>
                </div>
                {viewModal.data.occupants.map((o, i) => (
                  <div key={i} style={s.occupantRow}>
                    <div style={s.occupantDot} />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px" }}>{o.fullName}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>{o.email} · {o.branch}</div>
                    </div>
                  </div>
                ))}
                {Array.from({ length: (capacity[viewModal.data.type] || 1) - viewModal.data.occupants.length }).map((_, i) => (
                  <div key={i} style={{ ...s.occupantRow, opacity: 0.4 }}>
                    <div style={{ ...s.occupantDot, background: "#e5e7eb" }} />
                    <div style={{ fontSize: "14px", color: "#999" }}>Vacant bed</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div style={s.modalTitle}>Student Details</div>
                <div style={{ fontSize: "14px", color: "#333", lineHeight: "2" }}>
                  <b>Name:</b> {viewModal.data.fullName}<br />
                  <b>Email:</b> {viewModal.data.email}<br />
                  <b>Phone:</b> {viewModal.data.phone}<br />
                  <b>Branch:</b> {viewModal.data.branch || "-"}<br />
                  <b>Preference:</b> {viewModal.data.hostelPreference || "-"}<br />
                  <b>Status:</b> <span style={s.badge(viewModal.data.hostelStatus)}>{viewModal.data.hostelStatus?.replace("_", " ")}</span><br />
                  {viewModal.data.hostelStatus === "allotted" && <><b>Room:</b> {viewModal.data.allottedBlock} — {viewModal.data.allottedRoom}<br /></>}
                </div>
              </>
            )}
            <button style={s.confirmBtn} onClick={() => setViewModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  title: { fontSize: "22px", fontWeight: "800", color: "#003566", margin: 0 },
  sub: { fontSize: "14px", color: "#666", margin: 0 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "14px" },
  stat: { background: "#fff", borderRadius: "12px", padding: "18px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  viewToggle: { display: "flex", gap: "8px" },
  toggleBtn: (active) => ({ padding: "10px 20px", borderRadius: "8px", border: "none", background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#003566", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: "14px" }),
  card: { background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#003566", paddingBottom: "8px", borderBottom: "2px solid #ffc300", margin: "0 0 16px 0" },
  legend: { display: "flex", alignItems: "center", fontSize: "13px", color: "#555" },
  dot: (color) => ({ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: color, marginRight: "4px" }),
  filters: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "7px 16px", borderRadius: "20px", border: "1px solid #003566", background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#003566", fontWeight: "600", cursor: "pointer", fontSize: "13px" }),
  roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "12px" },
  roomBox: (bg, color) => ({ background: bg, color, borderRadius: "12px", padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }),
  empty: { textAlign: "center", padding: "40px", color: "#999", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#003566", color: "#ffc300", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "700" },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", color: "#333" },
  badge: (status) => {
    const map = { pending: ["#fef9c3", "#ca8a04"], allotted: ["#dcfce7", "#16a34a"], rejected: ["#fee2e2", "#dc2626"], not_requested: ["#f3f4f6", "#6b7280"] };
    const [bg, color] = map[status] || map.not_requested;
    return { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: bg, color };
  },
  prefBadge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "#dbeafe", color: "#1d4ed8" },
  allotBtn: { padding: "6px 10px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" },
  rejectBtn: { padding: "6px 10px", borderRadius: "6px", border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" },
  viewBtn: { padding: "6px 10px", borderRadius: "6px", border: "none", background: "#003566", color: "#ffc300", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "440px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: "18px", fontWeight: "800", color: "#003566", marginBottom: "16px" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box", marginBottom: "12px" },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "6px" },
  confirmBtn: { width: "100%", padding: "12px", background: "#003566", color: "#ffc300", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", marginTop: "8px" },
  cancelBtn: { width: "100%", padding: "10px", background: "#f3f4f6", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginTop: "8px" },
  occupantRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", background: "#f9fafb", marginBottom: "8px" },
  occupantDot: { width: "12px", height: "12px", borderRadius: "50%", background: "#16a34a", flexShrink: 0 },
};
