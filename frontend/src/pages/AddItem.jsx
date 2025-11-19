import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/addItem.css';
import '../styles/button.css';
/**
 * @component AddItem
 * @description
 * Provides a form for adding a new item under a selected category in a project.
 * Features include:
 *  - Input for item name
 *  - File upload for item image with preview
 *  - Form validation to ensure required fields are completed
 *  - Saves new item to backend API
 *  - Options to navigate to item detail, back to category, or dashboard after saving
 * @returns {JSX.Element} The rendered Add Item form component.
 */
export default function AddItem() {
  const { categoryId, projectId } = useParams();
  const [itemName, setItemName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [newItemId, setNewItemId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();
 const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


  useEffect(() => {
    fetch(`${API_BASE_URL}/categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategoryName(data.categoryName))
      .catch(() => {});
  }, [categoryId, API_BASE_URL]);
  /**
   * @function handleSave
   * @description
   * Validates that all required fields are filled.
   * Creates FormData to include name, image, categoryId, and projectId.
   * Sends POST request to backend to save item.
   * Updates `newItemId` state on success and alerts user.
   */
  const handleSave = async () => {
    if (!itemName || !imageFile) {
      alert("Please fill in all fields");// ensures that required input forms are filled in
      return;
    }
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("image", imageFile);
    formData.append("categoryId", categoryId);
    formData.append("projectId", projectId);
    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
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
  /**
   * @function handleGoToCategory
   * @description
   * Navigates back to the category page for the current project.
   */
  const handleGoToCategory = () => {
    navigate("/categories/new/" + projectId);
  };
  /**
   * @function handleGoToDetail
   * @description
   * Navigates to the item detail page for the newly saved item.
   * Alerts user if no item ID is available.
   */
  const handleGoToDetail = () => {
    if (newItemId) {
      navigate(`/item_detail/${newItemId}`);
    } else {
      alert("No item ID available yet");
    }
  };
  /**
   * @function handleCancel
   * @description
   * Cancels the form and navigates back to the category page.
   */
  const handleCancel = () => {
    navigate("/categories/new/" + projectId);
  };

  const isFormComplete = itemName.trim() !== "" && imageFile !== null;// Helps determine if form is valid

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




