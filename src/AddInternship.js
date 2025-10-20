// src/AddInternship.js
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export default function AddInternship({ user, showToast, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, "internships", editId), {
          title,
          description,
          requirements,
          applyLink,
          postedAt: serverTimestamp(),
        });
        showToast?.("✅ Internship updated!", "success");
        setEditId(null);
      } else {
        await addDoc(collection(db, "internships"), {
          title,
          description,
          requirements,
          applyLink,
          postedAt: serverTimestamp(),
          postedBy: user.uid,
        });
        showToast?.("✅ Internship posted!", "success");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setRequirements("");
      setApplyLink("");

      // Notify parent to refresh internship list
      onAdded?.();
    } catch (err) {
      console.error(err);
      showToast?.("❌ Failed to post/update.", "error");
    }
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "background 0.2s ease",
  };

  return (
    <div style={{
      backgroundColor: "#F9F7F7",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "500px",
      margin: "0 auto"
    }}>
      <h2 style={{ textAlign: "center", color: "#112D4E" }}>
        {editId ? "Edit Internship" : "Post an Internship"}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", resize: "none" }}
        />
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Requirements"
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none", resize: "none" }}
        />
        <input
          value={applyLink}
          onChange={(e) => setApplyLink(e.target.value)}
          placeholder="Apply Link"
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
        />
        <button
          type="submit"
          style={{ ...buttonStyle, backgroundColor: "#00ADB5", color: "#F9F7F7" }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#3F72AF"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#00ADB5"}
        >
          {editId ? "Update Internship" : "Post Internship"}
        </button>
      </form>
    </div>
  );
}
