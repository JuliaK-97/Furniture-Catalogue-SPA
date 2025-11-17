import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/addItem.css';
import '../styles/button.css';

export default function AddItem() {
  const { categoryId, projectId } = useParams();
  const [itemName, setItemName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [newItemId, setNewItemId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategoryName(data.categoryName))
      .catch(() => {});
  }, [categoryId]);

  const handleSave = async () => {
    if (!itemName || !imageFile) {
      alert("Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("image", imageFile);
    formData.append("categoryId", categoryId);
    formData.append("projectId", projectId);
    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        body: formData
      });
      const savedItem = await res.json();
      setNewItemId(savedItem._id);
      alert("Item saved! Choose next action.");
    } catch {
      alert("Error saving item");
    }
  };

  const handleGoToCategory = () => {
    navigate("/categories/new/" + projectId);
  };

  const handleGoToDetail = () => {
    if (newItemId) {
      navigate(`/item_detail/${newItemId}`);
    } else {
      alert("No item ID available yet");
    }
  };

  const handleCancel = () => {
    navigate("/categories/new/" + projectId);
  };

  const isFormComplete = itemName.trim() !== "" && imageFile !== null;

  return (
    <div className="add-item-form">
      <h2>Add New Item</h2>
      <p>Adding under category: <strong>{categoryName || categoryId}</strong></p>
      <div className="form-group">
        <label>Item Name:</label>
        <input
          type="text"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Enter item name"
        />
      </div>
      <div className="form-group">
        <label>Upload Image of item:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
        />
        {imageFile && (
          <div className="image-preview">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" />
          </div>
        )}
      </div>
      <div className="button-group">
        <button className="btn btn-save" disabled={!isFormComplete} onClick={handleSave}>Save</button>
        <button className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-dashboard" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
      {newItemId && (
        <div className="post-save-options">
          <p>Item was successfully saved. What would you like to do?</p>
          <button className="btn btn-dashboard" onClick={handleGoToCategory}>Back to Category</button>
          <button className="btn btn-detail" onClick={handleGoToDetail}>Go to Item Detail</button>
        </div>
      )}
    </div>
  );
}




