import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/itemCatalogue.css";
import '../styles/button.css';

export default function ItemCatalogue() {
  const { projectId, categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/itemCats?projectId=${projectId}&categoryId=${categoryId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to fetch catalogue items:", err));

    fetch(`http://localhost:5000/api/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategoryName(data.categoryName))
      .catch(err => console.error("Failed to fetch category:", err));
  }, [projectId, categoryId]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async () => {
    if (selectedItemId) {
      const res = await fetch(`http://localhost:5000/api/itemCats/${selectedItemId}/confirm`, {
        method: "POST"
      });
      const newItem = await res.json();
      navigate(`/item_detail/${newItem._id}`);
    }
  };

  const handleCancel = () => {
    navigate(`/categories/new/${projectId}`);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="item-catalogue">
      <h2>Browse items in Category: {categoryName || categoryId}</h2>
      <input
        type="text"
        placeholder="Search items by name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="item-grid">
        {filteredItems.map(item => (
          <div
            key={item._id}
            className={`item-card ${selectedItemId === item._id ? "selected" : ""}`}
            onClick={() => setSelectedItemId(item._id)}
          >
            <img src={`http://localhost:5000${item.image}`} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <div className="actions">
        <button className=" btn btn-select" disabled={!selectedItemId} onClick={handleSelect}>Confirm</button>
        <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-dashboard" onClick={handleDashboard}>To Dashboard</button>
      </div>
    </div>
  );
}
