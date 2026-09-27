import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGraduationCap, FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../api";

const roleConfig = {
  admin:   { label: "Admin",   icon: <FaUserShield />,        accent: "#4f46e5", bg: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)", redirect: "/admin", canRegister: true },
  staff:   { label: "Staff",   icon: <FaChalkboardTeacher />, accent: "#0d9488", bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)", redirect: "/staff", canRegister: false },
  student: { label: "Student", icon: <FaUserGraduate />,      accent: "#f97316", bg: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)", redirect: "/profile", canRegister: false },
};

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const config = roleConfig[role] || roleConfig.student;
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const canRegister = config.canRegister;
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "register" : "login";
      const body = isRegister ? { ...form, role } : { email: form.email, password: form.password, role };
      const res = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      navigate(config.redirect);
    } catch {
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Left Panel */}
      <div style={{ flex: 1, background: config.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", position: "relative" }}>
        <button onClick={() => navigate("/portal")} style={{ position: "absolute", top: "24px", left: "24px", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.1)", color: "#6b7280", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}>
          <FaArrowLeft /> Back
        </button>

        <div style={{ textAlign: "center", maxWidth: "320px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: `${config.accent}20`, border: `2px solid ${config.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: config.accent, margin: "0 auto 24px" }}>
            {config.icon}
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#1e1b4b", marginBottom: "12px" }}>
            {config.label} Portal
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7 }}>
            Welcome to QuickCampus. Sign in using the credentials sent to your registered email after admission approval.
          </p>

          <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
            {[
              canRegister ? "Create your admin account" : "Credentials sent via email",
              "Secure JWT authentication",
              "Real-time data sync",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: config.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: "10px", fontWeight: "900" }}>✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
            <div style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, #4f46e5, #f97316)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaGraduationCap style={{ color: "#fff", fontSize: "16px" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "#4f46e5" }}>QuickCampus</span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#1e1b4b", marginBottom: "6px" }}>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px" }}>
            {isRegister ? `Register as ${config.label}` : `Sign in to your ${config.label} account`}
          </p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", color: "#dc2626", fontSize: "13px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {isRegister && canRegister && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Full Name</label>
                <input name="name" value={form.name} onChange={handle} required placeholder="Your full name"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = config.accent}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            )}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com"
                style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = config.accent}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handle} required placeholder="••••••••"
                  style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => e.target.style.borderColor = config.accent}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px" }}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", background: config.accent, color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "800", cursor: "pointer", boxShadow: `0 6px 20px ${config.accent}40`, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.9"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          {canRegister && (
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ color: config.accent, fontWeight: "700", cursor: "pointer" }}>
                {isRegister ? "Sign In" : "Register"}
              </span>
            </div>
          )}
          {!canRegister && (
            <div style={{ textAlign: "center", marginTop: "20px", padding: "12px", background: `${config.accent}10`, borderRadius: "8px", fontSize: "13px", color: config.accent, fontWeight: "600" }}>
              📧 Your login credentials were sent to your registered email after admission approval.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
