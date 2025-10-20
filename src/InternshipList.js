// src/InternshipList.js
import { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ApplyFormModal from "./ApplyFormModal";
import { FiFilter } from "react-icons/fi";
import "./index.css";

export default function InternshipList({ showToast }) {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");

  const searchRef = useRef(null);

  // Fetch internships from Firestore
  useEffect(() => {
    const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInternships(data);

      // Extract unique skills for dropdown
      const skillsSet = new Set();
      data.forEach((job) => {
        if (job.requirements) {
          job.requirements
            .split(/[,;]+/)
            .map((skill) => skill.trim())
            .forEach((skill) => skill && skillsSet.add(skill));
        }
      });
      setSkillsList(Array.from(skillsSet));
    });

    return () => unsubscribe();
  }, []);

  // Filter internships based on title and selected skill
  useEffect(() => {
    const filtered = internships.filter((job) => {
      const titleField = job.title || "";
      const titleMatch = titleField.toLowerCase().includes(searchText.toLowerCase());

      const skillMatch =
        selectedSkill === "" ||
        (job.requirements && job.requirements.toLowerCase().includes(selectedSkill.toLowerCase()));

      return titleMatch && skillMatch;
    });

    setFilteredInternships(filtered);
  }, [searchText, selectedSkill, internships]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSkillsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
    <div style={{ width: "90%", margin: "40px auto", animation: "fadeIn 0.6s ease-in-out" }}>
      <h1 style={{ color: "#3F72AF", fontWeight: 700, textAlign: "center", marginBottom: "30px" }}>
        <b>AVAILABLE INTERNSHIPS</b>
      </h1>

      {/* Modern Search Bar */}
      <div className="search-bar-container" ref={searchRef}>
        <FiFilter
          className="filter-icon"
          onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
        />
        <input
          type="text"
          placeholder="Search by Internship Title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        {showSkillsDropdown && skillsList.length > 0 && (
          <div className="skills-dropdown">
            {selectedSkill && (
              <div className="skill-item clear-filter" onClick={() => setSelectedSkill("")}>
                Clear Filter
              </div>
            )}

            {skillsList.map((skill) => (
              <div
                key={skill}
                className={`skill-item ${selectedSkill === skill ? "selected-skill" : ""}`}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredInternships.length === 0 && (
        <p style={{ color: "#555", textAlign: "center" }}>No internships found.</p>
      )}

      <div className="internship-grid">
        {filteredInternships.map((job) => (
          <div key={job.id} className="internship-card">
            <h2 style={{ textAlign: "center" }}><b>{job.title}</b></h2>
            <p style={{ color: "#112D4E", fontSize: "0.95rem", lineHeight: "1.5" }}>
              {job.description}
            </p>
            {job.requirements && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Requirements:</strong> {job.requirements}
              </p>
            )}
            {job.companyLocation && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Location:</strong> {job.companyLocation}
              </p>
            )}
            {job.duration && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Duration:</strong> {job.duration}
              </p>
            )}
            {job.stipend && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Stipend:</strong> {job.stipend}
              </p>
            )}
            {job.companyEmail && (
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Company Email:</strong> {job.companyEmail}
              </p>
            )}

            <div className="action-buttons">
              <button
                onClick={() => setSelectedInternship(job)}
                className="apply-btn"
              >
                Apply Here
              </button>

              {job.websiteUrl && (
                <a
                  href={job.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="visit-btn"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <ApplyFormModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
