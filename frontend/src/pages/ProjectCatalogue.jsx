import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/projectCatalogue.css';
import '../styles/button.css';
/**
 * @component ProjectCatalogue
 * @description
 * Displays all items for a specific project in a tabular catalogue.
 * Supports filtering by name, category, and lot number, as well as item deletion and navigation to item details.
 * Uses `projectId` from the URL to fetch project info and related catalogue items.
 * Includes buttons for viewing details, deleting items, and navigating back to dashboard.
 * @returns {JSX.Element} The rendered project catalogue component.
 */
export default function ProjectCatalogue() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    lot: ''
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  /**
   * Fetch project info and catalogue items when the component mounts or projectId changes. Errors are handled gracefully.
   * Two fetch calls: one for project info, one for items to separate concerns.
   * .catch blocks: ensures UI doesn't crash if server is unavailable.
   */
  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setProjectName(data.name))
      .catch(() => setProjectName('Unknown Project'));

    fetch(`${API_BASE_URL}/catalogue/${projectId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, [projectId, API_BASE_URL]);
  /**
   * Apply filters in real-time on the frontend
   * Filters are applied using Array.filter for efficiency and instant UX.
   * toLowerCase ensures case-insensitive matching.
   */
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    item.categoryName.toLowerCase().includes(filters.category.toLowerCase()) &&
    item.lotNumber.toLowerCase().includes(filters.lot.toLowerCase())
  );

  return (
    <div className="project-catalogue">
      <h2>Project Catalogue: {projectName}</h2>
      <p>Status: Editable</p>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={e => setFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Filter by lot number"
          value={filters.lot}
          onChange={e => setFilters(prev => ({ ...prev, lot: e.target.value }))}
        />
      </div>
      <table className="compact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Lot</th>
            <th>Condition</th>
            <th>Location</th>
            <th>Actions</th>
         </tr>
       </thead>
       <tbody>
         {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.categoryName}</td>
                <td>{item.lotNumber}</td>
                <td>{item.condition}</td>
                <td>
                   {item.location ? (
                     <>
                       {item.location.area && <div>A: {item.location.area}</div>}
                      {item.location.zone && <div>Zn: {item.location.zone}</div>}
                      {item.location.floor && <div>Fl: {item.location.floor}</div>}
                     </>
                   ) : (
                    "No location"
                  )}
                </td>
                <td className="actions-cell">
                  <button className="btn btn-detail" onClick={() => navigate(`/item_detail/${item._id}`)}>View</button>
                  <button
                    className="btn btn-delete"
                    onClick={async () => {
                      await fetch(`${API_BASE_URL}/catalogue/${item._id}`, { method: "DELETE" });
                      setItems(prev => prev.filter(i => i._id !== item._id));
                    }}
                   >Delete</button>
                </td>
             </tr>
          ))
       ) : (
         <tr>
           <td colSpan="6">No items found for this project.</td>
         </tr>
       )}
      </tbody>
    </table>
      <button className="btn btn-dashboard" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}


