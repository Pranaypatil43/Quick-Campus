import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaGraduationCap,
  FaMoneyBillWave, FaBed, FaBus, FaFileAlt, FaCheckCircle,
  FaBars, FaTimes, FaArrowRight, FaPlay
} from "react-icons/fa";

const C = {
  bg: "#fafaf8",
  white: "#ffffff",
  indigo: "#4f46e5",
  indigoLight: "#818cf8",
  coral: "#f97316",
  coralLight: "#fed7aa",
  teal: "#0d9488",
  text: "#1e1b4b",
  muted: "#6b7280",
  border: "#e5e7eb",
  cardBg: "#ffffff",
  heroBg: "linear-gradient(135deg, #eef2ff 0%, #fef3c7 50%, #f0fdfa 100%)",
};

const features = [
  { icon: <FaGraduationCap />, title: "Smart Admissions", desc: "End-to-end digital admission with document upload, online payment & auto login credential generation.", color: C.indigo },
  { icon: <FaMoneyBillWave />, title: "Fee Management", desc: "Assign, track and collect fees online. Students pay via Card, UPI or Net Banking directly from their portal.", color: C.coral },
  { icon: <FaBed />, title: "Hostel Management", desc: "Visual room grid, occupancy tracking and hostel allotment with room preference selection during admission.", color: C.teal },
  { icon: <FaChartLine />, title: "Live Analytics", desc: "Real-time admin dashboard with student count, revenue collected, pending fees and admission stats.", color: C.indigo },
  { icon: <FaUsers />, title: "Multi-Role Access", desc: "Separate portals for Admin and Staff. Parents receive updates via WhatsApp & Email — no login needed.", color: C.coral },
  { icon: <FaFileAlt />, title: "Document Vault", desc: "Secure upload and admin verification of student documents during the admission process.", color: C.teal },
  { icon: <FaBus />, title: "Transport Management", desc: "Manage transport fees and assign students to routes directly from the admin panel.", color: C.indigo },
  { icon: <FaShieldAlt />, title: "Secure & Reliable", desc: "JWT authentication, bcrypt encrypted passwords and MongoDB Atlas cloud storage for data safety.", color: C.coral },
];

const stats = [
  { val: "5+", label: "Core Modules" },
  { val: "3", label: "User Roles" },
  { val: "100%", label: "Cloud Based" },
  { val: "₹0", label: "Setup Cost" },
];

const plans = [
  { name: "Starter", price: "₹999", period: "/month", highlight: false, features: ["Up to 500 students", "Admin + Staff portal", "Fee management", "Basic reports", "Email support"] },
  { name: "Pro", price: "₹2,499", period: "/month", highlight: true, features: ["Up to 5,000 students", "All portals included", "Hostel & Transport", "Live analytics", "WhatsApp + Email alerts", "Priority support"] },
  { name: "Enterprise", price: "Custom", period: "", highlight: false, features: ["Unlimited students", "Custom branding", "API access", "Dedicated server", "24/7 support", "On-site training"] },
];

const whyUs = [
  { icon: "📱", title: "No Parent Login Needed", desc: "Parents get fee updates, announcements and student info directly on WhatsApp and Email — no app to install, no password to remember." },
  { icon: "🎓", title: "Google Classroom Integration", desc: "Assignments and academic sharing use Google Classroom — a platform students and teachers already know, reducing cost and learning curve." },
  { icon: "⚡", title: "Live in 24 Hours", desc: "No complex setup. Your institution can go fully digital in less than a day with zero IT staff required." },
  { icon: "🔒", title: "Data Security First", desc: "All sensitive student data is encrypted and stored securely on MongoDB Atlas cloud with role-based access control." },
];

const testimonials = [
  { name: "Dr. Rajesh Kumar", role: "Principal, MIT College", text: "QuickCampus transformed our admission process. What took 2 weeks now happens in 2 hours.", stars: 5 },
  { name: "Prof. Sneha Patil", role: "Admin, Pune University", text: "The WhatsApp notification for parents is brilliant. No more calls asking about fee status.", stars: 5 },
  { name: "Mr. Anil Sharma", role: "Finance Head, DY Patil", text: "Fee collection went from 60% to 98% after students could pay online from their portal.", stars: 5 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", background: `linear-gradient(135deg, ${C.indigo}, ${C.coral})`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaGraduationCap style={{ color: "#fff", fontSize: "18px" }} />
          </div>
          <span style={{ fontSize: "22px", fontWeight: "900", color: C.indigo }}>QuickCampus</span>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["features", "pricing"].map((item) => (
            <span key={item} onClick={() => scrollTo(item)} style={{ cursor: "pointer", color: C.muted, fontSize: "15px", fontWeight: "500", textTransform: "capitalize", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = C.indigo}
              onMouseLeave={(e) => e.target.style.color = C.muted}
            >{item}</span>
          ))}
          <button onClick={() => navigate("/portal")} style={{ padding: "10px 24px", background: C.indigo, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
            Login Portal
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", background: C.heroBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#eef2ff", border: `1px solid ${C.indigoLight}`, borderRadius: "20px", padding: "6px 18px", marginBottom: "28px" }}>
          <FaRocket style={{ color: C.coral, fontSize: "13px" }} />
          <span style={{ fontSize: "13px", color: C.indigo, fontWeight: "700" }}>QuickCampus — ERP-based Student Management System</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: "900", lineHeight: 1.1, marginBottom: "24px", maxWidth: "820px", color: C.text }}>
          One Platform for All
          <br />
          <span style={{ color: C.coral }}>Campus Operations</span>
        </h1>
        <p style={{ fontSize: "18px", color: C.muted, maxWidth: "600px", lineHeight: 1.8, marginBottom: "44px" }}>
          QuickCampus is an ERP-based Integrated Student Management System that centralizes admissions, fees, hostel, attendance and results — while keeping parents informed via WhatsApp & Email without any separate login.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => navigate("/portal")} style={{ padding: "15px 36px", background: C.indigo, color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "800", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 8px 24px rgba(79,70,229,0.3)` }}>
            Get Started Free <FaArrowRight />
          </button>
          <button onClick={() => scrollTo("features")} style={{ padding: "15px 36px", background: C.white, color: C.text, border: `2px solid ${C.border}`, borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaPlay style={{ fontSize: "12px", color: C.coral }} /> See Features
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "56px", marginTop: "80px", flexWrap: "wrap", justifyContent: "center" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "34px", fontWeight: "900", color: C.indigo }}>{s.val}</div>
              <div style={{ fontSize: "13px", color: C.muted, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 48px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: C.coral, textTransform: "uppercase", letterSpacing: "2px" }}>Everything You Need</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "900", marginTop: "12px", color: C.text }}>One Platform, Infinite Possibilities</h2>
          <p style={{ color: C.muted, fontSize: "16px", marginTop: "12px" }}>Every module your institution needs, seamlessly connected.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", transition: "all 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: "48px", height: "48px", background: `${f.color}15`, border: `1px solid ${f.color}30`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: f.color, marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: C.text }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section style={{ padding: "100px 48px", background: "#f0f4ff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: C.coral, textTransform: "uppercase", letterSpacing: "2px" }}>Why QuickCampus</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", marginTop: "12px", color: C.text }}>Built Different. Priced Fair.</h2>
            <p style={{ color: C.muted, fontSize: "16px", marginTop: "12px", maxWidth: "560px", margin: "12px auto 0" }}>We focused on simplicity, cost-effectiveness and ease of use — not complexity.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", marginBottom: "64px" }}>
            {whyUs.map((w, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{w.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: C.text, marginBottom: "8px" }}>{w.title}</h3>
                <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "900", color: C.text, marginBottom: "20px" }}>Everything included, nothing extra</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {["No per-user licensing fees", "Cloud-hosted, zero maintenance", "Works on mobile & desktop", "Free onboarding & training", "Data export anytime, no lock-in"].map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FaCheckCircle style={{ color: C.teal, fontSize: "16px", flexShrink: 0 }} />
                    <span style={{ fontSize: "15px", color: C.text }}>{p}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/portal")} style={{ marginTop: "32px", padding: "13px 28px", background: C.coral, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 6px 20px rgba(249,115,22,0.3)` }}>
                Get Started Free <FaArrowRight />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { val: "24hrs", label: "Go Live Time", color: C.indigo },
                { val: "10x", label: "Faster Admissions", color: C.coral },
                { val: "98%", label: "Fee Collection Rate", color: C.teal },
                { val: "0", label: "IT Staff Needed", color: C.indigo },
              ].map((s) => (
                <div key={s.label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "36px", fontWeight: "900", color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "13px", color: C.muted, marginTop: "6px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: C.coral, textTransform: "uppercase", letterSpacing: "2px" }}>Pricing</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "900", marginTop: "12px", color: C.text }}>Simple, Transparent Pricing</h2>
          <p style={{ color: C.muted, fontSize: "16px", marginTop: "12px" }}>No hidden fees. No surprises. Cancel anytime.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ background: plan.highlight ? C.indigo : C.white, border: `2px solid ${plan.highlight ? C.indigo : C.border}`, borderRadius: "20px", padding: "36px", position: "relative", transition: "transform 0.2s", boxShadow: plan.highlight ? `0 16px 48px rgba(79,70,229,0.25)` : "0 2px 8px rgba(0,0,0,0.05)" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {plan.highlight && <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: C.coral, color: "#fff", padding: "4px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px", color: plan.highlight ? "#fff" : C.text }}>{plan.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
                <span style={{ fontSize: "40px", fontWeight: "900", color: plan.highlight ? "#fff" : C.indigo }}>{plan.price}</span>
                <span style={{ fontSize: "14px", color: plan.highlight ? "#c7d2fe" : C.muted }}>{plan.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaCheckCircle style={{ color: plan.highlight ? C.coralLight : C.teal, fontSize: "14px", flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", color: plan.highlight ? "#e0e7ff" : C.text }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/portal")} style={{ width: "100%", padding: "12px", background: plan.highlight ? C.coral : C.indigo, color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "15px" }}>
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 48px", background: `linear-gradient(135deg, ${C.indigo} 0%, #7c3aed 100%)`, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: "900", color: "#fff", marginBottom: "16px" }}>
          Ready to Digitize Your Institution?
        </h2>
        <p style={{ color: "#c7d2fe", fontSize: "18px", marginBottom: "40px" }}>Join institutions already running on QuickCampus.</p>
        <button onClick={() => navigate("/portal")} style={{ padding: "16px 48px", background: "#fff", color: C.indigo, border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "800", fontSize: "17px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          Get Started Free →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: `linear-gradient(135deg, ${C.indigo}, ${C.coral})`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaGraduationCap style={{ color: "#fff", fontSize: "16px" }} />
          </div>
          <span style={{ fontWeight: "900", fontSize: "16px", color: C.indigo }}>QuickCampus</span>
        </div>
        <span style={{ color: C.muted, fontSize: "13px" }}>© 2025 QuickCampus. All rights reserved.</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} style={{ color: C.muted, fontSize: "13px", cursor: "pointer" }}
              onMouseEnter={(e) => e.target.style.color = C.indigo}
              onMouseLeave={(e) => e.target.style.color = C.muted}
            >{l}</span>
          ))}
        </div>
      </footer>

      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } html { scroll-behavior: smooth; }`}</style>
    </div>
  );
}
