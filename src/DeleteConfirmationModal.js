// src/DeleteConfirmationModal.js
export default function DeleteConfirmationModal({ onConfirm, onCancel, message }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "#F9F7F7",
        padding: "30px",
        borderRadius: "12px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>
        <p style={{ marginBottom: "20px", color: "#112D4E" }}>{message || "Are you sure?"}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: "#FF5C5C",
              color: "#F9F7F7",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 500
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#D32F2F"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#FF5C5C"}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#3F72AF",
              color: "#F9F7F7",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 500
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#112D4E"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#3F72AF"}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
