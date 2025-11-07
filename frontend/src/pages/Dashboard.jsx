
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/button.css'


const initialProjects = [
  { id: 'p-01', name: 'Company A', items: 165, categories: 3, lastUpdated: '2025-11-04', status: 'open' },
  { id: 'p-02', name: 'Company B', items: 500, categories: 3, lastUpdated: '2025-11-06', status: 'open' }
]

export default function Dashboard() {
  const [projects, setProjects] = useState(initialProjects)
   const navigate = useNavigate()

  const handleClose = (id) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'closed' } : p
      )
    )
  }

  const handleOpen = (project) => {
    if (project.status === 'closed') {
      // Closed project → read-only catalogue view
      navigate(`/catalogue/${project.id}?mode=readonly`)
    } else {
      // Open project → editable catalogue view
      navigate(`/catalogue/${project.id}?mode=edit`)
    }
  }
  const handleCreateProject = () => {
    const name = prompt("Enter a name for the new project:")
    if (!name) return 

    const newProject = {
      id: `p-${projects.length + 1}`,
      name,
      items: 0,
      categories: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'open'
    }

    setProjects(prev => [...prev, newProject])
    navigate(`/categories/new`)
  }


  return (
    <div>
      <button className="btn-new" onClick={handleCreateProject}>
        + New Project
      </button>
      <h2>Current Projects</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {projects.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <h2>{p.name}</h2>
            <strong>Categories:</strong> {p.categories}<br />
            <strong>Last Updated:</strong> {p.lastUpdated}<br />
            <strong>Status:</strong> {p.status}<br />
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-open" onClick={() => handleOpen(p)}>
                Open Project
              </button>
              <button
                className="btn btn-close"
                onClick={() => handleClose(p.id)}
                disabled={p.status === 'closed'}
              >
                Close Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
