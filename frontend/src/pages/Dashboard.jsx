
import { useState } from 'react'
import '../styles/button.css'

const initialProjects = [
  { id: 'p-01', name: 'Company A', items: 165, categories: 3, lastUpdated: '2025-11-04', status: 'open' },
  { id: 'p-02', name: 'Company B', items: 500, categories: 3, lastUpdated: '2025-11-06', status: 'open' }
]

export default function Dashboard() {
  const [projects, setProjects] = useState(initialProjects)
  const [open, setOpen] = useState(null)

  const handleClose = (id) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'closed' } : p
      )
    )
  }

  const handleOpen = (id) => {
    setOpen(id)
    // Placeholder for Epic 6
    alert(`Viewing Project ${id} — Catalogue view will be implemented later`)
  }

  return (
    <div>
      <h2>Current Projects</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {projects.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <h2>{p.name}</h2>
            <strong>Categories:</strong> {p.categories}<br />
            <strong>Last Updated:</strong> {p.lastUpdated}<br />
            <strong>Status:</strong> {p.status}<br />
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-open" onClick={() => handleOpen(p.id)}>
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
            {open === p.id && (
              <div style={{ marginTop: 8 }}>
                <p>Viewing details for {p.name}...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
