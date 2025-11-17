import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/categorySelection.css';
import '../styles/button.css';

export default function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleConfirm = () => {
    if (selectedCategory) {
      navigate(`/item_Cat/${projectId}/${selectedCategory}`);
    }
  };

  const handleAddNewItem = () => {
    if (selectedCategory) {
      navigate(`/items/new/${projectId}/${selectedCategory}`);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleCreateCategory = async () => {
    const name = prompt("Enter a name for the new category:");
    if (!name) return;
    const newCategory = { categoryName: name };
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
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


