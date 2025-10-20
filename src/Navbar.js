// src/Navbar.js
import React from "react";

export default function Navbar({ user, onLogout, goHome }) {
  return (
    <nav className="navbar">
      {/* Left: Logo + Brand */}
      <div className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="Logo"
        />
        <span>InternSphere</span>
      </div>

      {/* Right: Actions */}
      <div className="nav-actions">
        {user && (
          <button className="nav-btn logout" onClick={onLogout}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
    
  );
}
