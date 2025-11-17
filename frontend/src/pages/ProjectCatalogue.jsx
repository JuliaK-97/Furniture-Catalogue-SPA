import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/projectCatalogue.css';
import '../styles/button.css';

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

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setProjectName(data.name))
      .catch(() => setProjectName('Unknown Project'));

    fetch(`http://localhost:5000/api/catalogue/${projectId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, [projectId]);

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
                      await fetch(`http://localhost:5000/api/catalogue/${item._id}`, { method: "DELETE" });
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


