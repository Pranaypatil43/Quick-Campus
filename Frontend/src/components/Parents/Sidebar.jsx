import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaMoneyBillWave,
  FaBed,
  FaClipboardList,
  FaCheckCircle,
  FaChartLine,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import LogoutButton from "../LogoutButton";

const ParentSidebar = ({ isOpen, setIsOpen }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/parent/profile", icon: <FaUser />, label: "Parent Portal" },
    { to: "/parent/payments", icon: <FaMoneyBillWave />, label: "Payment History" },
    { to: "/parent/hostel", icon: <FaBed />, label: "Hostel Status" },
    { to: "/parent/results", icon: <FaClipboardList />, label: "Examination Results" },
    { to: "/parent/attendance", icon: <FaCheckCircle />, label: "Attendance Record" },
    { to: "/parent/progress", icon: <FaChartLine />, label: "Student Progress" },
  ];

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white">Parent Portal</h2>
        )}
        <button
          onClick={() =>
            window.innerWidth < 768 ? setMobileOpen(false) : setIsOpen(!isOpen)
          }
          className="text-white"
        >
          {window.innerWidth < 768 ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#ffc300] text-black font-bold shadow-md"
                  : "text-white hover:bg-[#ffc300] hover:text-black"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 mt-auto border-t border-gray-700">
          <p className="text-sm text-gray-300">{localStorage.getItem("name") || "Parent"}</p>
          <p className="text-xs text-gray-400">Parent Account</p>
          <div className="mt-2"><LogoutButton collapsed={collapsed} /></div>
        </div>
      )}
      {collapsed && (
        <div className="p-3"><LogoutButton collapsed={collapsed} /></div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex h-screen fixed transition-all duration-300 z-30 bg-[#003566] ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <SidebarContent collapsed={!isOpen} />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="m-4 text-2xl fixed z-40 text-white"
        >
          <FaBars />
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>
        )}

        <div
          className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 bg-[#003566] ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent collapsed={false} />
        </div>
      </div>
    </>
  );
};

export default ParentSidebar;
