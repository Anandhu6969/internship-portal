// src/App.js
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Navbar from "./Navbar";
import InternshipList from "./InternshipList";
import AddInternship from "./AddInternship";
import ViewApplicants from "./ViewApplicants";
import RecruiterDashboard from "./RecruiterDashboard";
import "./index.css";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showToast = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogin = (role, user) => {
    setUserRole(role);
    setUser(user);
    showToast(`✅ Logged in as ${role === "intern" ? "Intern" : "Recruiter"}!`, "success");
  };

  const handleLogout = () => {
    setUserRole(null);
    setUser(null);
    showToast("⚠ Logged out successfully!", "error");
  };

  const goHome = () => {
    setUserRole(null);
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} goHome={goHome} />

      {/* Toast Notification */}
      {message && (
        <div className={`toast-message ${messageType}`}>
          {message}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Home onLogin={handleLogin} showToast={showToast} />
            ) : userRole === "intern" ? (
              <Navigate to="/internships" />
            ) : (
              <Navigate to="/recruiter" />
            )
          }
        />

        <Route
          path="/internships"
          element={
            user && userRole === "intern" ? (
              <InternshipList showToast={showToast} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/recruiter"
          element={
            user && userRole === "recruiter" ? (
              <RecruiterDashboard user={user} showToast={showToast} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/add-internship"
          element={
            user && userRole === "recruiter" ? (
              <AddInternship user={user} showToast={showToast} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/view-applicants/:internshipId"
          element={
            user ? <ViewApplicants showToast={showToast} /> : <Navigate to="/" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
