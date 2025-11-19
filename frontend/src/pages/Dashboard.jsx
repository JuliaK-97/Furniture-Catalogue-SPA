import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/button.css';
import '../styles/dashboard.css';
import QuickStats from '../components/QuickStats.jsx';
/**
 * @component Dashboard
 * @description
 * Displays the main dashboard for managing projects.
 * Includes:
 *  - Project creation button
 *  - QuickStats summary component
 *  - Grid of current projects with options to open, close, select category, or delete
 * Fetches projects from the backend API on mount.
 * @returns {JSX.Element} The rendered dashboard component.
 */
export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  /**
   * Fetch projects on component mount.
   * useEffect with empty dependency array ensures that it runs only once.
   * The try-catch pattern ensures that network errors are properly handled.
   */
  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => setError("Failed to load projects"));//personalised feedback to users
  }, [API_BASE_URL]);
/**
 * @function handleClose
 * @description
 * Sends a PATCH request to update the status of a project to "closed".
 * Updates the local state `projects` to reflect the change in real time.
 * @param {String} id - The ID of the project to close.
 * @returns {Promise<void>} Updates local project state with the updated project.
 */
  const handleClose = async (id) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" })
    });
    const updated = await res.json();
    // Update projects array in state; only modify the changed project
    setProjects(prev => prev.map(p => (p._id === id ? updated : p)));
  };
/**
 * @function handleOpen
 * @description
 * Navigates to the project's catalogue page.
 * If the project is closed, the route will include a `mode=readonly` query parameter to prevent editing.
 * @param {Object} project - The project object to open.
 * @param {String} project._id - The unique ID of the project.
 * @param {String} project.status - Current status of the project ("open" or "closed").
 * @returns {void} Navigates to the appropriate route.
 */
  const handleOpen = (project) => {
    const path = project.status === 'closed'
      ? `/catalogue/${project._id}?mode=readonly`
      : `/catalogue/${project._id}`;
    navigate(path);// guide user to next step
  };
/**
 * @function handleCreateProject
 * @description
 * Prompts the user to enter a project name, then creates a new project via POST request.
 * Updates the `projects` state to include the new project at the top.
 * Navigates the user to the category creation page for the newly created project.
 * @returns {Promise<void>} Updates state and navigates to category creation page.
 */
  const handleCreateProject = async () => {
    const name = prompt("Enter a name for the new project:");
    if (!name) return;
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const newProject = await res.json();
    setProjects(prev => [newProject, ...prev]);
    navigate(`/categories/new/${newProject._id}`);
  };
/**
 * @function handleDelete
 * @description
 * Deletes a project by its ID via DELETE request.
 * Updates the `projects` state by removing the deleted project.
 * Alerts the user if deletion fails.
 * @param {String} id - The ID of the project to delete.
 * @returns {Promise<void>} Updates local state or shows error alert.
 */
  const handleDelete = async (id) => {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE"
  });
  const result = await res.json();
  if (res.ok) {
    setProjects(prev => prev.filter(p => p._id !== id));// remove deleted project
  } else {
    alert(result.error || "Failed to delete project");
  }
};


  return (
    <div className="dashboard-container">
      <button className="btn-new" onClick={handleCreateProject}>+ New Project</button>
      <QuickStats projects={projects} />
      <h2>Current Projects</h2>
      {error && <p className="error">{error}</p>}
      <div className="project-grid">
        {projects.map(p => (
          <div key={p._id} className="project-card">
            <h2>{p.name}</h2>
            <strong>Categories:</strong> {p.categoryCount}<br />
            <strong>Items:</strong> {p.itemCount}<br />
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
              <button className="btn btn-close" onClick={() => handleClose(p._id)} disabled={p.status === 'closed'}>Close Project</button>
              <button className="btn btn-add-category" onClick={() => navigate(`/categories/new/${p._id}`)}>Select Category</button>
             <button className="btn btn-danger" 
             onClick={() => handleDelete(p._id)}>Delete Project</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


