import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "../styles/projectCatalogue.css";

export default function ProjectCatalogue() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const navigate = useNavigate();


  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    lotNumber: "",
  });

  useEffect(() => {
    const mockItems = [
      { id: "i1", name: "White desk", category: "Desk", lotNumber: "LOT-001" },
      { id: "i2", name: "Pleather castor Chair", category: "Castor Chair", lotNumber: "LOT-002" },
      { id: "i3", name: "Sliding door credenza", category: "Credenza", lotNumber: "LOT-003" },
    ];
    setItems(mockItems);
  }, [projectId]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id) => {
    if (mode === "readonly") return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/item_detail/${id}`);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    item.category.toLowerCase().includes(filters.category.toLowerCase()) &&
    item.lotNumber.toLowerCase().includes(filters.lotNumber.toLowerCase())
  );

  return (
    <div className="project-catalogue">
      <h2>Project Catalogue: {projectId}</h2>
      <p>Status: {mode === "readonly" ? "Read-only" : "Editable"}</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by lot number"
          value={filters.lotNumber}
          onChange={(e) => handleFilterChange("lotNumber", e.target.value)}
        />
      </div>

      <table className="compact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Lot</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.lotNumber}</td>
              <td>
                {mode === "readonly" ? (
                  <em>Locked</em>
                ) : (
                  <>
                    <button className="btn-edit" onClick={() => handleEdit(item.id)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn-back" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}
