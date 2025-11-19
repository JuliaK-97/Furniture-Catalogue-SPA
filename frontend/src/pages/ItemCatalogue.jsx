import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/itemCatalogue.css";
import '../styles/button.css';
/**
 * @component ItemCatalogue
 * @description
 * Displays a list of items for a specific category within a project.
 * Provides:
 *  - A search bar to filter items by name in real-time.
 *  - A selectable grid of item cards, highlighting the selected item.
 *  - Buttons to confirm selection, cancel, or return to the dashboard.
 * Fetches items for the given `projectId` and `categoryId` from the backend on mount.
 * Fetches category details to display the category name in the header.
 * @returns {JSX.Element} The rendered item catalogue component.
 */
export default function ItemCatalogue() {
  const { projectId, categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetch(`${API_BASE_URL}/itemCats?projectId=${projectId}&categoryId=${categoryId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to fetch catalogue items:", err));

    fetch(`${API_BASE_URL}/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategoryName(data.categoryName))
      .catch(err => console.error("Failed to fetch category:", err));
  }, [projectId, categoryId, API_BASE_URL]);//re-run effect when category or project changes
  // Filters items in real-time based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  /**
   * @function handleSelect
   * @description
   * Confirms the selected item by sending a POST request.
   * Navigates to the detail page for the newly confirmed item.
   * @returns {Promise<void>} Updates selection and navigates to item detail.
   */
  const handleSelect = async () => {
    if (selectedItemId) {
      const res = await fetch(`${API_BASE_URL}/itemCats/${selectedItemId}/confirm`, {
        method: "POST"
      });
      const newItem = await res.json();
      navigate(`/item_detail/${newItem._id}`);
    }
  };
  /**
   * @function handleCancel
   * @description
   * Navigates back to the category selection page.
   */
  const handleCancel = () => {
    navigate(`/categories/new/${projectId}`);
  };
  /**
   * @function handleDashboard
   * @description
   * Navigates back to the main dashboard.
   */
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
            <img src={`${API_BASE_URL.replace("/api", "")}${item.image}`} alt={item.name} />
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
