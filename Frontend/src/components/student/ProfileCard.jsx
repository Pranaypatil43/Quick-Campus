import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { FaUserGraduate, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaIdCard } from "react-icons/fa";

const ACCENT = "#f97316";

export default function ProfileCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/profile").then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div style={s.loading}>Loading profile...</div>;
  if (!data) return <div style={s.loading}>Failed to load profile.</div>;

  const a = data.admission;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerCard}>
        <div style={s.avatar}><FaUserGraduate style={{ fontSize: "44px", color: ACCENT }} /></div>
        <div style={s.headerInfo}>
          <h1 style={s.name}>{data.name}</h1>
          <p style={s.sub}>{a?.branch || "—"} · {a?.semester || "—"}</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
            <span style={s.badge}>Student</span>
            {a?.doa && <span style={{ ...s.badge, background: "#fff7ed", color: ACCENT }}>Admitted: {new Date(a.doa).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      <div style={s.grid2}>
        {/* Personal Info */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Personal Information</h2>
          {[
            { label: "Full Name", value: a?.fullName || data.name },
            { label: "Login Email", value: data.email, icon: <FaEnvelope /> },
            { label: "Personal Email", value: a?.email || "—", icon: <FaEnvelope /> },
            { label: "Phone", value: a?.phone || "—", icon: <FaPhone /> },
            { label: "Date of Birth", value: a?.dob ? new Date(a.dob).toLocaleDateString() : "—", icon: <FaCalendar /> },
            { label: "Gender", value: a?.gender || "—" },
            { label: "Address", value: a?.previousSchool ? `Prev: ${a.previousSchool}` : "—", icon: <FaMapMarkerAlt /> },
          ].map(({ label, value, icon }) => (
            <div key={label} style={s.field}>
              <span style={s.label}>{label}</span>
              <span style={s.value}>{icon && <span style={{ marginRight: "6px", color: ACCENT }}>{icon}</span>}{value}</span>
            </div>
          ))}
        </div>

        {/* Academic Info */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Academic Details</h2>
          {[
            { label: "Branch", value: a?.branch || "—" },
            { label: "Semester", value: a?.semester || "—" },
            { label: "Previous School", value: a?.previousSchool || "—" },
            { label: "Date of Admission", value: a?.doa ? new Date(a.doa).toLocaleDateString() : "—" },
            { label: "Admission Status", value: a?.status || "—" },
            { label: "Member Since", value: new Date(data.createdAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} style={s.field}>
              <span style={s.label}>{label}</span>
              <span style={s.value}>{value}</span>
            </div>
          ))}
        </div>

        {/* Parent Info */}
        {a?.parentName && (
          <div style={s.card}>
            <h2 style={s.sectionTitle}>Parent / Guardian</h2>
            {[
              { label: "Parent Name", value: a.parentName },
              { label: "Parent Email", value: a.parentEmail, icon: <FaEnvelope /> },
              { label: "Parent Phone", value: a.parentPhone, icon: <FaPhone /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={s.field}>
                <span style={s.label}>{label}</span>
                <span style={s.value}>{icon && <span style={{ marginRight: "6px", color: ACCENT }}>{icon}</span>}{value || "—"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hostel Info */}
        {a?.hostelRequired && (
          <div style={s.card}>
            <h2 style={s.sectionTitle}>Hostel Details</h2>
            {[
              { label: "Hostel Required", value: "Yes" },
              { label: "Room Preference", value: a.hostelPreference || "—" },
              { label: "Hostel Status", value: a.hostelStatus?.replace("_", " ") || "—" },
              { label: "Allotted Block", value: a.allottedBlock || "Pending" },
              { label: "Room Number", value: a.allottedRoom || "Pending" },
            ].map(({ label, value }) => (
              <div key={label} style={s.field}>
                <span style={s.label}>{label}</span>
                <span style={s.value}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  loading: { padding: "40px", textAlign: "center", color: "#6b7280" },
  headerCard: { background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "24px", border: "1px solid #fed7aa" },
  avatar: { width: "88px", height: "88px", borderRadius: "50%", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${ACCENT}`, flexShrink: 0 },
  headerInfo: { flex: 1 },
  name: { fontSize: "24px", fontWeight: "900", color: "#1e1b4b", margin: 0 },
  sub: { fontSize: "14px", color: "#6b7280", margin: "4px 0 0" },
  badge: { background: "#eef2ff", color: "#4f46e5", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" },
  sectionTitle: { fontSize: "15px", fontWeight: "800", color: "#1e1b4b", marginBottom: "16px", paddingBottom: "8px", borderBottom: `2px solid ${ACCENT}` },
  field: { display: "flex", flexDirection: "column", gap: "2px", marginBottom: "14px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" },
  value: { fontSize: "14px", color: "#374151", fontWeight: "500", textTransform: "capitalize" },
};
