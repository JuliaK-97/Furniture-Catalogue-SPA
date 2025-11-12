import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/button.css';
import '../styles/dashboard.css';
import QuickStats from '../components/QuickStats.jsx';
import { useEffect } from 'react';




export default function Dashboard() {
  const [projects, setProjects] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/projects")
    .then(res => res.json())
    .then(data => setProjects(data))
    .catch(err => console.error("Failed to fetch projects:", err));
}, []);


  const navigate = useNavigate();

  const handleClose = async (id) => {
    const res = await fetch(`http://localhost:5000/api/projects/${id}/status`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status: "closed"})
    });
    const updated = await res.json();
    setProjects(prev => 
      prev.map(p => (p._id ===id ? updated: p))
    );
  };

  const handleOpen = (project) => {
    const path = project.status === 'closed'
      ? `/catalogue/${project._id}?mode=readonly`
      : `/catalogue/${project._id}`;
    navigate(path);
  };

  const handleCreateProject = async () => {
    const name = prompt("Enter a name for the new project:");
    if (!name) return;
   const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
    });

    const newProject = await res.json();
    setProjects(prev => [newProject, ...prev]);
    navigate('/categories/new');
  };

  return (
    <div className="dashboard-container">
      <button className="btn-new" onClick={handleCreateProject}>
        + New Project
      </button>
      <QuickStats projects={projects} />
      <h2>Current Projects</h2>
      <div className="project-grid">
        {projects.map(p => {
          console.log("Last updated raw:", p.lastUpdated); 

          return (
            <div key={p._id} className="project-card">
              <h2>{p.name}</h2>
              <strong>Categories:</strong> {p.categoryCount}<br />
              <strong>Last Updated:</strong>{" "}
              {p.lastUpdated
                ? new Date(p.lastUpdated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : "Not available"}
              <br />
              <strong>Status:</strong> {p.status}<br />
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-open" onClick={() => handleOpen(p)}>Open Project</button>
                <button
                  className="btn btn-close"
                  onClick={() => handleClose(p._id)}
                  disabled={p.status === 'closed'}
                >Close Project</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

