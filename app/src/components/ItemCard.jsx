// ItemCard.jsx
import { useNavigate } from "react-router";
import "./ItemCard.css";

export function ItemCard({ item, showRequest = true }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    if (!status) return "#999";
    if (status === "active") return "#0b6b3a";
    if (status === "closed") return "#555";
    if (status === "removed") return "#c0392b";
    return "#888";
  };

  const getStatusText = (status) => {
    if (status === "active") return "Available";
    if (status === "closed") return "Recovered";
    if (status === "removed") return "Removed";
    return status;
  };

  return (
    <div className="glass hover-card item-card">
      {/* TITLE */}
      <div>
        <h3 className="item-title">
          {item.itemName}
        </h3>
      </div>

      {/* DETAILS */}
      <div className="item-details">
        <p className="item-text">
          <b>📍 Location:</b> {item.loc}
        </p>

        <p className="item-text">
          <b>📅 Date:</b> {item.date}
        </p>
      </div>

      {/* STATUS */}
      <div>
        <span
          className="item-status"
          style={{
            background: getStatusColor(item.status)
          }}
        >
          {getStatusText(item.status)}
        </span>
      </div>

      {/* BUTTON */}
      {showRequest && item.status === "active" && (
        <button
          className="btn-primary item-btn"
          onClick={() => navigate("/confirm", {state: { itemId: item.id }})}
        >
          Prove Ownership
        </button>
      )}
    </div>
  );
}
