import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ApplyFormModal({ internship, onClose, showToast }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [batch, setBatch] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "applications"), {
        internshipId: internship.id,
        firstName,
        lastName,
        email,
        phone,
        institution,
        batch,
        experience,
        resumeLink,
        message,
        appliedAt: serverTimestamp(),
      });

      showToast?.("✅ Application submitted successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      showToast?.("❌ Failed to submit application.", "error");
    }
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    flex: 1,
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#F9F7F7",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#112D4E", textAlign: "center" }}>
          Apply for {internship.title}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Batch (e.g., 2020-2024)" value={batch} onChange={(e) => setBatch(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Experience / Skills" value={experience} onChange={(e) => setExperience(e.target.value)} required style={inputStyle} />
          <input type="url" placeholder="Resume Link" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Additional message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" }} />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: "#3F72AF", color: "#F9F7F7" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#112D4E")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3F72AF")}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: "#FF5C5C", color: "#F9F7F7" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#D32F2F")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FF5C5C")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
