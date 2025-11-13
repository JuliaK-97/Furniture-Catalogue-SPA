import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/categorySelection.css';

export default function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  const handleSelect = () => {
    if (selectedCategory) {
      navigate(`/item_Cat/${projectId}/${selectedCategory}`);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleCreateCategory = async () => {
    const name = prompt("Enter a name for the new category:");
    if (!name) return;

    const newCategory = {
      categoryName: name,
      items: 0,
      lastUpdated: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory)
      });

      const savedCategory = await res.json();
      setCategories(prev => [...prev, savedCategory]);
      navigate(`/items/new/${savedCategory._id}`);
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <div className="category-selection">
      <h2>Select a Category</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`category-btn ${selectedCategory === cat._id ? "selected" : ""}`}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
      <div className="actions">
        <button
          className="btn-select"
          disabled={!selectedCategory}
          onClick={handleSelect}
        >
          Confirm
        </button>
        <button className="btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="btn-add-category" onClick={handleCreateCategory}>
          Add New Category
        </button>
      </div>
    </div>
  );
}
