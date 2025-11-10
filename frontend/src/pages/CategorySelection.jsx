import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/categorySelection.css';

export default function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    { id: "Credenza", categoryName: "Credenza" },
    { id: "Pedestal", categoryName: "Pedestal" },
    { id: "Desks", categoryName: "Desks" },
    { id: "Castor Chairs", categoryName: "Castor Chairs" },
    { id: "Soft-seating", categoryName: "Soft-seating" }
  ]);

  const navigate = useNavigate();

  const handleSelect = () => {
    if (selectedCategory) {
      navigate(`/item_Cat/${selectedCategory}`);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleCreateCategory = () => {
    const name = prompt("Enter a name for the new category:");
    if (!name) return;

    const newCategory = {
      id: `c-${Date.now()}`,
      categoryName: name,
      items: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setCategories((prev) => [...prev, newCategory]);
    navigate(`/items/new/${newCategory.id}`);
  };

  return (
    <div className="category-selection">
      <h2>Select a Category</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${
              selectedCategory === cat.id ? "selected" : ""
            }`}
            onClick={() => setSelectedCategory(cat.id)}
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
