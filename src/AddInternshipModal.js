// src/AddInternshipModal.js
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

export default function AddInternshipModal({ user, onClose, showToast, editData, refreshList }) {
  const [title, setTitle] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (editData) {
      setEditId(editData.id);
      setTitle(editData.title || "");
      setCompanyLocation(editData.companyLocation || "");
      setDescription(editData.description || "");
      setRequirements(editData.requirements || "");
      setDuration(editData.duration || "");
      setStipend(editData.stipend || "");
      setCompanyEmail(editData.companyEmail || "");
      setWebsiteUrl(editData.websiteUrl || "");
    } else {
      setEditId(null);
      setTitle("");
      setCompanyLocation("");
      setDescription("");
      setRequirements("");
      setDuration("");
      setStipend("");
      setCompanyEmail("");
      setWebsiteUrl("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast?.("❌ User not authenticated.", "error");
      return;
    }

    try {
      const internshipData = {
        title,
        companyLocation,
        description,
        requirements,
        duration,
        stipend,
        companyEmail,
        websiteUrl,
        postedAt: serverTimestamp(),
      };

      if (editId) {
        // Update existing internship
        await updateDoc(doc(db, "internships", editId), internshipData);
        showToast?.("✅ Internship updated!", "success");
      } else {
        // Add new internship
        await addDoc(collection(db, "internships"), {
          ...internshipData,
          postedBy: user.uid,
        });
        showToast?.("✅ Internship posted!", "success");
      }

      refreshList?.(); // Refresh the dashboard list
      onClose?.();     // Close the modal
    } catch (err) {
      console.error(err);
      showToast?.("❌ Failed to post/update internship.", "error");
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
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "#F9F7F7",
        padding: "30px",
        borderRadius: "12px",
        width: "400px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>
        <h2 style={{ marginTop: 0, color: "#112D4E", textAlign: "center" }}>
          {editId ? "Edit Internship" : "Post an Internship"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Company Location" value={companyLocation} onChange={e => setCompanyLocation(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ ...inputStyle, resize: "none" }} />
          <textarea placeholder="Requirements" value={requirements} onChange={e => setRequirements(e.target.value)} required style={{ ...inputStyle, resize: "none" }} />
          <input type="text" placeholder="Duration (e.g., 3 months)" value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Stipend (e.g., 15000 INR)" value={stipend} onChange={e => setStipend(e.target.value)} style={inputStyle} />
          <input type="email" placeholder="Company Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Website URL" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} style={inputStyle} />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{ ...buttonStyle, backgroundColor: "#3F72AF", color: "#F9F7F7" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#112D4E"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#3F72AF"}
            >
              {editId ? "Update" : "Post"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonStyle, backgroundColor: "#FF5C5C", color: "#F9F7F7" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#D32F2F"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#FF5C5C"}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
