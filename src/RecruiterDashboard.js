// src/RecruiterDashboard.js
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AddInternshipModal from "./AddInternshipModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { AiOutlinePlus } from "react-icons/ai";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RecruiterDashboard({ user, showToast }) {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Fetch internships and applications
  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      try {
        const q = query(collection(db, "internships"), where("postedBy", "==", user.uid));
        const internSnap = await getDocs(q);
        const internData = internSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setInternships(internData);

        const appData = [];
        for (let internship of internData) {
          const appQuery = query(collection(db, "applications"), where("internshipId", "==", internship.id));
          const appSnap = await getDocs(appQuery);
          appSnap.forEach(docSnap => {
            appData.push({ id: docSnap.id, internshipTitle: internship.title, ...docSnap.data() });
          });
        }
        setApplications(appData);

      } catch (err) {
        console.error(err);
        showToast?.("❌ Failed to fetch dashboard data.", "error");
      }
    };

    fetchData();
  }, [user?.uid, showToast]);

  const refreshInternships = async () => {
    if (!user?.uid) return;

    try {
      const q = query(collection(db, "internships"), where("postedBy", "==", user.uid));
      const internSnap = await getDocs(q);
      const internData = internSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setInternships(internData);
    } catch (err) {
      console.error(err);
      showToast?.("❌ Failed to refresh internships.", "error");
    }
  };

  const handleEdit = (internship) => {
    setEditData(internship);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "internships", deleteId));
      setInternships(internships.filter(i => i.id !== deleteId));
      showToast?.("⚠ Internship deleted!", "error");
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      showToast?.("❌ Failed to delete internship.", "error");
    }
  };

  const graphData = internships.map((i) => ({
    title: i.title.length > 15 ? i.title.slice(0, 12) + "..." : i.title,
    applicants: applications.filter(app => app.internshipId === i.id).length,
  }));

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(7px)",
    WebkitBackdropFilter: "blur(7px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    padding: "20px",
    flex: 1,
    minWidth: "180px",
    margin: "10px",
    display: "flex",             // ✅ flexbox layout
    flexDirection: "column",     // ✅ vertical stacking
    justifyContent: "center",    // ✅ vertical center
    alignItems: "center",        // ✅ horizontal center
    textAlign: "center",
    transition: "transform 0.2s ease",
  };



  const floatingButtonStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "#00ADB5",
    color: "#F9F7F7",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  };

  return (
    <div style={{ width: "90%", margin: "30px auto" }}>
      <h1 style={{ color: "#16447cff", textAlign: "center" }}><b>RECRUITER DASHBOARD</b></h1>

      {/* Analytics with glass blur container */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h2 style={{ margin: "10px 0", color: "#112D4E" }}>{internships.length}</h2>
          <p>Total Internships Posted</p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: "10px 0", color: "#112D4E" }}>{applications.length}</h2>
          <p>Total Applicants</p>
        </div>


        <div style={{ ...cardStyle, minWidth: "250px" }}>
          <h3 style={{ marginBottom: "10px", color: "#112D4E" }}>Applicants per Internship</h3>
          {graphData.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={graphData}>
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applicants" fill="#00ADB5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>



      {/* Posted Internships */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#124078ff", paddingBottom: "20px", textAlign: "center" }}>
          <b>YOUR POSTED INTERNSHIPS</b>
        </h2>
        {internships.length === 0 && <p>No internships posted yet.</p>}

        <div className="internship-grid">
          {internships.map((internship) => (
            <div key={internship.id} className="internship-card">
              <h3 style={{color: "#2d5381ff",textAlign:"center",paddingBottom:"10px"}}>{internship.title}</h3>
              {internship.companyLocation && <p><strong>Location:</strong> {internship.companyLocation}</p>}
              {internship.duration && <p><strong>Duration:</strong> {internship.duration}</p>}
              {internship.stipend && <p><strong>Stipend:</strong> {internship.stipend}</p>}
              {internship.description && <p><strong>Description:</strong> {internship.description}</p>}
              {internship.requirements && <p><strong>Requirements:</strong> {internship.requirements}</p>}
              {internship.companyEmail && <p><strong>Company Email:</strong> {internship.companyEmail}</p>}
              {internship.websiteUrl && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={internship.websiteUrl} target="_blank" rel="noreferrer">
                    {internship.websiteUrl}
                  </a>
                </p>
              )}
              {internship.applyLink && (
                <p>
                  <strong>Apply Link:</strong>{" "}
                  <a href={internship.applyLink} target="_blank" rel="noreferrer">
                    {internship.applyLink}
                  </a>
                </p>
              )}
              <div className="action-buttons" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => navigate(`/view-applicants/${internship.id}`)}
                  style={{ backgroundColor: "#00ADB5", color: "#F9F7F7", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
                >
                  Applicants
                </button>
                <button
                  onClick={() => handleEdit(internship)}
                  style={{ backgroundColor: "#3F72AF", color: "#F9F7F7", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(internship.id)}
                  style={{ backgroundColor: "#FF5C5C", color: "#F9F7F7", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Floating Add Button */}
      <button style={floatingButtonStyle} onClick={() => { setEditData(null); setShowModal(true); }}>
        <AiOutlinePlus />
      </button>

      {/* Add/Edit Internship Modal */}
      {showModal && (
        <AddInternshipModal
          user={user}
          onClose={() => setShowModal(false)}
          showToast={showToast}
          editData={editData}
          refreshList={refreshInternships}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this internship?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
