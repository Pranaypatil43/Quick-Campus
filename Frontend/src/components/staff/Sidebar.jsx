import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaChalkboardTeacher, FaEdit, FaCheckSquare, FaSearch, FaBars, FaTimes, FaGraduationCap } from "react-icons/fa";
import LogoutButton from "../LogoutButton";

const ACCENT = "#0d9488";
const BG = "#f0fdfa";
const WHITE = "#ffffff";
const TEXT = "#1e1b4b";
const MUTED = "#6b7280";
const BORDER = "#99f6e4";

const navItems = [
  { to: "/staff/profile", icon: <FaUser />, label: "Profile" },
  { to: "/staff/assignments", icon: <FaChalkboardTeacher />, label: "Assignments" },
  { to: "/staff/grades", icon: <FaEdit />, label: "Grade Entry" },
  { to: "/staff/attendance", icon: <FaCheckSquare />, label: "Attendance" },
  { to: "/staff/students", icon: <FaSearch />, label: "Student Lookup" },
];

const S = {
  sidebar: (width) => ({ width, height: "100vh", position: "fixed", top: 0, left: 0, backgroundColor: WHITE, borderRight: `1px solid ${BORDER}`, boxShadow: "4px 0 16px rgba(13,148,136,0.08)", zIndex: 30, transition: "width 0.3s", display: "flex", flexDirection: "column", overflowX: "hidden" }),
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px", borderBottom: `1px solid ${BORDER}`, background: BG },
  logo: { display: "flex", alignItems: "center", gap: "8px" },
  logoBox: { width: "32px", height: "32px", background: `linear-gradient(135deg, ${ACCENT}, #2dd4bf)`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: "16px", fontWeight: "900", color: ACCENT, whiteSpace: "nowrap" },
  toggleBtn: { background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: "18px", padding: "4px" },
  nav: { flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" },
  navLink: (isActive) => ({ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", transition: "all 0.15s", backgroundColor: isActive ? `${ACCENT}15` : "transparent", color: isActive ? ACCENT : MUTED, fontWeight: isActive ? "700" : "500", borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent" }),
  icon: { fontSize: "16px", flexShrink: 0 },
  label: { marginLeft: "10px", whiteSpace: "nowrap", fontSize: "14px" },
  footer: { padding: "16px", borderTop: `1px solid ${BORDER}`, background: BG },
  footerName: { fontSize: "14px", fontWeight: "700", color: TEXT },
  footerRole: { fontSize: "12px", color: MUTED, marginBottom: "10px" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 40 },
  mobileBtn: { position: "fixed", top: "16px", left: "16px", zIndex: 40, background: WHITE, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "8px", fontSize: "20px", color: ACCENT, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
};

const SidebarContent = ({ collapsed, onClose }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={S.header}>
      {!collapsed && (
        <div style={S.logo}>
          <div style={S.logoBox}><FaGraduationCap style={{ color: "#fff", fontSize: "16px" }} /></div>
          <span style={S.logoText}>QuickCampus</span>
        </div>
      )}
      <button style={S.toggleBtn} onClick={onClose}>{collapsed ? <FaBars /> : <FaTimes />}</button>
    </div>
    <nav style={S.nav}>
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} onClick={() => window.innerWidth < 768 && onClose && onClose()}
          style={({ isActive }) => S.navLink(isActive)}
          onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor.includes("15")) { e.currentTarget.style.backgroundColor = `${ACCENT}10`; e.currentTarget.style.color = ACCENT; } }}
          onMouseLeave={(e) => { const active = e.currentTarget.getAttribute("aria-current") === "page"; if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = MUTED; } }}
        >
          <span style={S.icon}>{item.icon}</span>
          {!collapsed && <span style={S.label}>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
    <div style={S.footer}>
      {!collapsed && <>
        <p style={S.footerName}>{localStorage.getItem("name") || "Staff"}</p>
        <p style={S.footerRole}>Faculty Member</p>
      </>}
      <LogoutButton collapsed={collapsed} />
    </div>
  </div>
);

export default function StaffSidebar({ isOpen, setIsOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <div style={{ display: "none" }} className="md-staff-wrapper">
        <style>{`.md-staff-wrapper { display: block; }`}</style>
        <div style={S.sidebar(isOpen ? "256px" : "72px")}>
          <SidebarContent collapsed={!isOpen} onClose={() => setIsOpen(!isOpen)} />
        </div>
      </div>
      <button style={S.mobileBtn} className="mobile-staff" onClick={() => setMobileOpen(true)}><FaBars /></button>
      {mobileOpen && <div style={S.overlay} onClick={() => setMobileOpen(false)} className="mobile-staff" />}
      <div className="mobile-staff" style={{ ...S.sidebar("256px"), zIndex: 50, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
      </div>
      <style>{`@media(min-width:768px){.mobile-staff{display:none!important}.md-staff-wrapper{display:block!important}}@media(max-width:767px){.md-staff-wrapper{display:none!important}.mobile-staff{display:block!important}}`}</style>
    </>
  );
}
