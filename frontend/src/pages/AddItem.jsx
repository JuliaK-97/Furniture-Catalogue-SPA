import { useParams } from "react-router-dom";

export default function AddItem() {
  const { categoryId } = useParams();

  return (
    <div className="add-item">
      <h2>Add New Item</h2>
      {categoryId ? (
        <p>Adding a new item under category: <strong>{categoryId}</strong></p>
      ) : (
        <p>No category selected. Please choose a category first.</p>
      )}

      <p>This is your AddItem page. Later you’ll build the form for item details.</p>
    </div>
  );
}

