import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./components/HomePage";
import AdmissionForm from "./components/AdmissionForm";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";

// Student
import StudentSidebar from "./components/student/Sidebar";
import ProfileCard from "./components/student/ProfileCard";
import FeePayment from "./components/student/FeePayment";
import HostelFee from "./components/student/HostelFee";
import TransportFee from "./components/student/TransportFee";
import PaymentHistory from "./components/student/PaymentHistory";
import Assignment from "./components/student/Assignment";
import Attendance from "./components/student/Attendance";
import Timetable from "./components/student/Timetable";
import Result from "./components/student/Result";
import UploadDocuments from "./components/student/UploadDocuments";
import ViewDocuments from "./components/student/ViewDocuments";
import AcademicCalendar from "./components/student/AcademicCalendar";

// Staff
import StaffSidebar from "./components/staff/Sidebar";
import ProfilePage from "./components/staff/ProfilePage";
import AssignmentsPage from "./components/staff/AssignmentsPage";
import GradeEntryPage from "./components/staff/GradeEntryPage";
import AttendancePage from "./components/staff/AttendancePage";
import StudentLookupPage from "./components/staff/StudentLookupPage";

// Parent
import ParentSidebar from "./components/Parents/Sidebar";
import ParentPaymentHistory from "./components/Parents/PaymentHistory";
import HostelStatus from "./components/Parents/HostelStatus";
import ExaminationResults from "./components/Parents/ExaminationResults";
import AttendanceRecord from "./components/Parents/AttendanceRecord";
import StudentProgress from "./components/Parents/StudentProgress";

// Admin
import AdminSidebar from "./components/admin/Sidebar";
import AdminProfilePage from "./components/admin/ProfilePage";
import AdmissionsPage from "./components/admin/AdmissionsPage";
import FinancePage from "./components/admin/FinancePage";
import HostelPage from "./components/admin/HostelPage";
import DashboardPage from "./components/admin/DashboardPage";
import AccessPage from "./components/admin/AccessPage";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/portal" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  const [isStudentSidebarOpen, setIsStudentSidebarOpen] = useState(true);
  const [isStaffSidebarOpen, setIsStaffSidebarOpen] = useState(true);
  const [isParentSidebarOpen, setIsParentSidebarOpen] = useState(true);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(true);

  return (
    <Router>
      <Content
        isStudentSidebarOpen={isStudentSidebarOpen} setIsStudentSidebarOpen={setIsStudentSidebarOpen}
        isStaffSidebarOpen={isStaffSidebarOpen} setIsStaffSidebarOpen={setIsStaffSidebarOpen}
        isParentSidebarOpen={isParentSidebarOpen} setIsParentSidebarOpen={setIsParentSidebarOpen}
        isAdminSidebarOpen={isAdminSidebarOpen} setIsAdminSidebarOpen={setIsAdminSidebarOpen}
      />
    </Router>
  );
}

function Content({
  isStudentSidebarOpen, setIsStudentSidebarOpen,
  isStaffSidebarOpen, setIsStaffSidebarOpen,
  isParentSidebarOpen, setIsParentSidebarOpen,
  isAdminSidebarOpen, setIsAdminSidebarOpen,
}) {
  const location = useLocation();
  const isPublic = location.pathname === "/" || location.pathname === "/portal" || location.pathname.startsWith("/login") || location.pathname === "/admission";
  const isStaff = location.pathname.startsWith("/staff");
  const isParent = location.pathname.startsWith("/parent");
  const isAdmin = location.pathname.startsWith("/admin");

  if (isPublic) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portal" element={<LandingPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/admission" element={<AdmissionForm />} />
      </Routes>
    );
  }

  const sidebarOpen = isStaff ? isStaffSidebarOpen
    : isParent ? isParentSidebarOpen
    : isAdmin ? isAdminSidebarOpen
    : isStudentSidebarOpen;

  return (
    <div style={{ display: "flex" }}>
      {isStaff ? (
        <StaffSidebar isOpen={isStaffSidebarOpen} setIsOpen={setIsStaffSidebarOpen} />
      ) : isParent ? (
        <ParentSidebar isOpen={isParentSidebarOpen} setIsOpen={setIsParentSidebarOpen} />
      ) : isAdmin ? (
        <AdminSidebar isOpen={isAdminSidebarOpen} setIsOpen={setIsAdminSidebarOpen} />
      ) : (
        <StudentSidebar isOpen={isStudentSidebarOpen} setIsOpen={setIsStudentSidebarOpen} />
      )}

      <main style={{ flex: 1, backgroundColor: "#f8fafc", minHeight: "100vh", transition: "margin 0.3s", marginLeft: sidebarOpen ? "256px" : "72px", padding: "24px" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          {/* Student */}
          <Route path="/profile" element={<ProtectedRoute allowedRole="student"><ProfileCard /></ProtectedRoute>} />
          <Route path="/academic-fee" element={<ProtectedRoute allowedRole="student"><FeePayment /></ProtectedRoute>} />
          <Route path="/hostel-fee" element={<ProtectedRoute allowedRole="student"><HostelFee /></ProtectedRoute>} />
          <Route path="/transport-fee" element={<ProtectedRoute allowedRole="student"><TransportFee /></ProtectedRoute>} />
          <Route path="/payment-history" element={<ProtectedRoute allowedRole="student"><PaymentHistory /></ProtectedRoute>} />
          <Route path="/assignment" element={<ProtectedRoute allowedRole="student"><Assignment /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute allowedRole="student"><Attendance /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute allowedRole="student"><Timetable /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute allowedRole="student"><Result /></ProtectedRoute>} />
          <Route path="/academic-calendar" element={<ProtectedRoute allowedRole="student"><AcademicCalendar /></ProtectedRoute>} />
          <Route path="/upload-documents" element={<ProtectedRoute allowedRole="student"><UploadDocuments /></ProtectedRoute>} />
          <Route path="/view-documents" element={<ProtectedRoute allowedRole="student"><ViewDocuments /></ProtectedRoute>} />

          {/* Staff */}
          <Route path="/staff" element={<ProtectedRoute allowedRole="staff"><Navigate to="/staff/profile" /></ProtectedRoute>} />
          <Route path="/staff/profile" element={<ProtectedRoute allowedRole="staff"><ProfilePage /></ProtectedRoute>} />
          <Route path="/staff/assignments" element={<ProtectedRoute allowedRole="staff"><AssignmentsPage /></ProtectedRoute>} />
          <Route path="/staff/grades" element={<ProtectedRoute allowedRole="staff"><GradeEntryPage /></ProtectedRoute>} />
          <Route path="/staff/attendance" element={<ProtectedRoute allowedRole="staff"><AttendancePage /></ProtectedRoute>} />
          <Route path="/staff/students" element={<ProtectedRoute allowedRole="staff"><StudentLookupPage /></ProtectedRoute>} />

          {/* Parent */}
          <Route path="/parent" element={<Navigate to="/parent/payments" />} />
          <Route path="/parent/payments" element={<ParentPaymentHistory />} />
          <Route path="/parent/hostel" element={<HostelStatus />} />
          <Route path="/parent/results" element={<ExaminationResults />} />
          <Route path="/parent/attendance" element={<AttendanceRecord />} />
          <Route path="/parent/progress" element={<StudentProgress />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Navigate to="/admin/dashboard" /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><AdminProfilePage /></ProtectedRoute>} />
          <Route path="/admin/admissions" element={<ProtectedRoute allowedRole="admin"><AdmissionsPage /></ProtectedRoute>} />
          <Route path="/admin/finance" element={<ProtectedRoute allowedRole="admin"><FinancePage /></ProtectedRoute>} />
          <Route path="/admin/hostel" element={<ProtectedRoute allowedRole="admin"><HostelPage /></ProtectedRoute>} />
          <Route path="/admin/access" element={<ProtectedRoute allowedRole="admin"><AccessPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
