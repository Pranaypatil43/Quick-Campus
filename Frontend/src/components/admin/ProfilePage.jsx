import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaUserShield, FaEdit, FaSave, FaTimes, FaUsers, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userFilter, setUserFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/admin/users").then((d) => setUsers(Array.isArray(d) ? d : [])),
      fetch("http://localhost:5000/api/student/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((r) => r.json()).then((d) => { setAdmin(d); setForm(d); }),
    ]).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const updated = await api.put("/student/profile", { name: form.name });
    setAdmin(updated);
    localStorage.setItem("name", updated.name);
    setEditing(false);
    setSaving(false);
  };

  const filteredUsers = userFilter === "all" ? users : users.filter((u) => u.role === userFilter);

  if (loading) return <div style={s.loading}>Loading...</div>;

  return (
    <div style={s.page}>
      {/* Header Card */}
      <div style={s.headerCard}>
        <div style={s.avatarBox}><FaUserShield style={s.avatarIcon} /></div>
        <div style={s.headerInfo}>
          <h1 style={s.name}>{admin?.name}</h1>
          <p style={s.email}>{admin?.email}</p>
          <span style={s.roleBadge}>ADMIN</span>
        </div>
        <button style={s.editBtn} onClick={() => setEditing(!editing)}>
          {editing ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
        </button>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[{ key: "profile", label: "My Profile" }, { key: "users", label: `All Users (${users.length})` }].map((t) => (
          <button key={t.key} style={s.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Account Information</h2>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              {editing ? (
                <input style={s.input} value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              ) : (
                <span style={s.value}>{admin?.name}</span>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <span style={s.value}>{admin?.email}</span>
            </div>
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <span style={s.value}>Administrator</span>
            </div>
            <div style={s.field}>
              <label style={s.label}>Member Since</label>
              <span style={s.value}>{admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "-"}</span>
            </div>
          </div>
          {editing && (
            <button style={s.saveBtn} onClick={save} disabled={saving}>
              <FaSave style={{ marginRight: "6px" }} />{saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div style={s.card}>
          <div style={s.usersHeader}>
            <h2 style={s.sectionTitle}>User Management</h2>
            <div style={s.filters}>
              {["all", "student", "staff", "admin"].map((f) => (
                <button key={f} style={s.filterBtn(userFilter === f)} onClick={() => setUserFilter(f)}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  {" "}({f === "all" ? users.length : users.filter((u) => u.role === f).length})
                </button>
              ))}
            </div>
          </div>
          <table style={s.table}>
            <thead>
              <tr>
                {["Name", "Email", "Role", "Joined"].map((h) => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: "#999" }}>No users found</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={s.td}>
                      <div style={s.userRow}>
                        <div style={s.userIcon(u.role)}>
                          {u.role === "student" ? <FaUserGraduate /> : u.role === "staff" ? <FaChalkboardTeacher /> : <FaUserShield />}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}><span style={s.badge(u.role)}>{u.role}</span></td>
                    <td style={s.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  loading: { padding: "40px", textAlign: "center", color: "#666" },
  headerCard: { background: "linear-gradient(135deg,#003566,#001d3d)", borderRadius: "16px", padding: "28px", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
  avatarBox: { width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,195,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #ffc300", flexShrink: 0 },
  avatarIcon: { fontSize: "36px", color: "#ffc300" },
  headerInfo: { flex: 1 },
  name: { fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 },
  email: { fontSize: "14px", color: "#d9d9d9", margin: "4px 0" },
  roleBadge: { background: "#ffc300", color: "#003566", padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800" },
  editBtn: { padding: "10px 20px", background: "rgba(255,195,0,0.15)", color: "#ffc300", border: "1px solid #ffc300", borderRadius: "8px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" },
  tabs: { display: "flex", gap: "8px" },
  tab: (active) => ({ padding: "10px 24px", borderRadius: "8px", border: "none", background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#003566", fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }),
  card: { background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#003566", marginBottom: "16px", paddingBottom: "8px", borderBottom: "2px solid #ffc300", margin: "0 0 16px 0" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#999", textTransform: "uppercase" },
  value: { fontSize: "15px", color: "#333", fontWeight: "500" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" },
  saveBtn: { marginTop: "20px", padding: "10px 24px", background: "#003566", color: "#ffc300", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", fontSize: "14px" },
  usersHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
  filters: { display: "flex", gap: "6px", flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "6px 14px", borderRadius: "20px", border: `1px solid #003566`, background: active ? "#003566" : "#fff", color: active ? "#ffc300" : "#003566", fontWeight: "600", cursor: "pointer", fontSize: "12px" }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#003566", color: "#ffc300", padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "700" },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: "13px", color: "#333" },
  userRow: { display: "flex", alignItems: "center", gap: "10px" },
  userIcon: (role) => ({ width: "30px", height: "30px", borderRadius: "50%", background: role === "student" ? "#dbeafe" : role === "staff" ? "#dcfce7" : "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: role === "student" ? "#1d4ed8" : role === "staff" ? "#16a34a" : "#ca8a04" }),
  badge: (role) => ({ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: role === "student" ? "#dbeafe" : role === "staff" ? "#dcfce7" : "#fef9c3", color: role === "student" ? "#1d4ed8" : role === "staff" ? "#16a34a" : "#ca8a04", textTransform: "capitalize" }),
};
