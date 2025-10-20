// src/ViewApplicants.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ViewApplicants() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [internshipTitle, setInternshipTitle] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // Get internship title
        const internshipSnap = await getDocs(
          query(collection(db, "internships"), where("__name__", "==", internshipId))
        );
        internshipSnap.forEach(doc => setInternshipTitle(doc.data().title));

        // Get applicants for this internship
        const q = query(collection(db, "applications"), where("internshipId", "==", internshipId));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      }
    };

    fetchApplicants();
  }, [internshipId]);

  return (
    <div style={{ width: "90%", margin: "20px auto" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#00ADB5",
            color: "#F9F7F7",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            marginRight: "15px",
            fontWeight: "500",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            transition: "background 0.2s ease",
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#3F72AF"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#00ADB5"}
        >
          Back
        </button>
        <h1 style={{ margin: 0, color: "#112D4E", textAlign: "center", paddingLeft: "25%" }}>APPLICANTS FOR "{internshipTitle}"</h1>
      </div>

      {applicants.length === 0 && <p>No applicants yet.</p>}

      {/* ✅ Grid layout for applicants */}
      <div className="internship-grid">
        {applicants.map(app => (
          <div key={app.id} className="internship-card">
            <p><b>Name:</b> {app.firstName} {app.lastName}</p>
            <p><b>Email:</b> {app.email}</p>
            <p><b>Phone:</b> {app.phone}</p>
            <p><b>Institution:</b> {app.institution}</p>
            <p><b>Batch:</b> {app.batch}</p>
            <p><b>Experience / Skills:</b> {app.experience}</p>
            <p><b>Resume Link:</b>{" "}
              {app.resumeLink ? (
                <a
                  href={app.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate-link"
                  title={app.resumeLink}
                >
                  {app.resumeLink}
                </a>
              ) : "N/A"}
            </p>
            {app.message && <p><b>Message:</b> {app.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
