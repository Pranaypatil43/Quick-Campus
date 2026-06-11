import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton({ collapsed }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/portal");
  };

  return (
    <button
      onClick={logout}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "10px 12px",
        borderRadius: "10px",
        border: "none",
        background: "#fef2f2",
        color: "#ef4444",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
      onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
    >
      <FaSignOutAlt style={{ fontSize: "18px", flexShrink: 0 }} />
      {!collapsed && <span style={{ marginLeft: "12px" }}>Logout</span>}
    </button>
  );
}
