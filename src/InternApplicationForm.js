// src/InternApplicationForm.js
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function InternApplicationForm({ internship, onClose, showToast }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "internships", internship.id, "applications"), {
        name,
        age,
        email,
        phone,
        skills,
        resume,
        appliedAt: serverTimestamp(),
      });
      showToast?.("✅ Application submitted successfully!", "success"); // toast instead of alert
      onClose?.();
    } catch (err) {
      console.error("Error submitting application: ", err);
      showToast?.("❌ Failed to submit application.", "error"); // toast instead of alert
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Apply for {internship.title}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <input type="number" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="text" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          <input type="text" placeholder="Skills / Experience" value={skills} onChange={(e)=>setSkills(e.target.value)} required />
          <input type="text" placeholder="Resume Link (optional)" value={resume} onChange={(e)=>setResume(e.target.value)} />
          <button type="submit">Submit Application</button>
        </form>
        <button className="visit-btn" onClick={() => window.open(internship.applyLink, "_blank")}>
          Visit Website for More Info
        </button>
        <button className="close-btn" onClick={onClose}>✖ Close</button>
      </div>
    </div>
  );
}
