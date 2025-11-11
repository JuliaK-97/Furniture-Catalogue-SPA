import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/addItem.css';

export default function AddItemForm() {
  const { categoryId } = useParams(); 
  const [itemName, setItemName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSave = () => {
    if (!itemName || !imageFile) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Saving item:', {
      category: categoryId,
      name: itemName,
      image: imageFile.name,
    });

    navigate('/item_Cat/' + categoryId);
  };

  const handleCancel = () => {
    console.log('Cancelled. Clearing form.');
    navigate('/item_Cat/' + categoryId);
  };
  const isFormComplete = itemName.trim() !== "" && imageFile !== null;


  return (
    <div className="add-item-form">
      <h2>Add New Item</h2>
      <p>Adding under category: <strong>{categoryId}</strong></p>

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
      </div>

      <div className="button-group">
        <button className="btn-save" disabled={!isFormComplete} onClick={handleSave}>Save</button>
        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
        <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>
    </div>
  );
}


