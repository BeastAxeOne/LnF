// import "./ContactCard.css";

export function ContactCard({ person, type }) {
  return (
    <div
      className="glass contact-card"
      style={{
        padding: "18px",
        borderRadius: "14px"
      }}
    >
      {/* TITLE */}
      <h2 style={{ marginBottom: "10px" }}>
        {type} Contact Info
      </h2>

      {/* EMAIL BLOCK */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0 }}>
          <strong>📧 CUET Email:</strong>{" "}
          <span style={{ opacity: 0.85 }}>
            {person?.mail || person?.email || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}