import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/categorySelection.css';
import '../styles/button.css';
/**
 * @component CategorySelection
 * @description
 * Displays a list of available categories for a project and allows the user to:
 *  - Select a category
 *  - Confirm selection to browse items in that category
 *  - Add a new item to a selected category
 *  - Add a new category dynamically
 *  - Cancel and return to the dashboard
 */
export default function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, [API_BASE_URL]);
  /**
   * @function handleCategoryClick
   * @description
   * Marks the clicked category as selected.
   * @param {string} categoryId - The ID of the clicked category
   */
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  /**
   * @function handleConfirm
   * @description
   * Navigates to the item catalogue page for the selected category.
   * Only executes if a category is selected.
   */
  const handleConfirm = () => {
    if (selectedCategory) {
      navigate(`/item_Cat/${projectId}/${selectedCategory}`);
    }
  };
  /**
   * @function handleAddNewItem
   * @description
   * Navigates to the new item creation page within the selected category.
   * Only executes if a category is selected.
   */
  const handleAddNewItem = () => {
    if (selectedCategory) {
      navigate(`/items/new/${projectId}/${selectedCategory}`);
    }
  };
  /**
   * @function handleCancel
   * @description
   * Navigates back to the dashboard.
   */
  const handleCancel = () => {
    navigate("/dashboard");
  };
  /**
   * @function handleCreateCategory
   * @description
   * Prompts the user to enter a new category name.
   * Sends a POST request to create the new category in the backend.
   * Updates local state to include the newly created category and selects it.
   */
  const handleCreateCategory = async () => {
    const name = prompt("Enter a name for the new category:");
    if (!name) return;
    const newCategory = { categoryName: name };
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory)
      });
      const savedCategory = await res.json();
      setCategories(prev => [...prev, savedCategory]);
      setSelectedCategory(savedCategory._id);
    } catch {}
  };

  return (
    <div className="category-selection">
      <h2>Select a Category</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`category-btn ${selectedCategory === cat._id ? "selected" : ""}`}
            onClick={() => handleCategoryClick(cat._id)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
      <div className="actions">
        <button className="btn btn-select" disabled={!selectedCategory} onClick={handleConfirm}>Confirm</button>
        <button className="btn btn-add-item" disabled={!selectedCategory} onClick={handleAddNewItem}>Add New Item</button>
        <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-add-category" onClick={handleCreateCategory}>Add New Category</button>
      </div>
    </div>
  );
}


