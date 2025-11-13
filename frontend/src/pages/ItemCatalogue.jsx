import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/itemCatalogue.css";

export default function ItemCatalogue() {
  const { projectId, categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  // Placeholder items (frontend-only for now)
  const items = [
    { id: "item-001", name: "White desk", image: "/images/white-desk.jpg" },
    { id: "item-002", name: "Pleather Castor chair", image: "/images/pleather-castor-chair.jpg" },
    { id: "item-003", name: "Sliding door credenza", image: "/images/sliding-door-credenza.jpg" },
    { id: "item-004", name: "2 seater couch", image: "/images/2-seater-couch.jpg" }
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedItemId) {
      navigate(`/item_detail/${selectedItemId}`);
    }
  };

  const handleCancel = () => {
    // Return to Category Selection for the current project
    navigate(`/categories/new/${projectId}`);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="item-catalogue">
      <h2>Browse items in Category: {categoryId}</h2>

      <input
        type="text"
        placeholder="Search items by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="item-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`item-card ${selectedItemId === item.id ? "selected" : ""}`}
            onClick={() => setSelectedItemId(item.id)}
          >
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <div className="actions">
        <button
          className="btn-select"
          disabled={!selectedItemId}
          onClick={handleSelect}
        >
          Confirm
        </button>
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn-dashboard" onClick={handleDashboard}>
          To Dashboard
        </button>
      </div>
    </div>
  );
}
