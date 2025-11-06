
const mockProjects = [
    {id: 'p-01', name: 'Company A', items: 165, categories: 3, lastUpdated: '2025-11-04'},
    {id: 'p-02', name: 'Company B', items: 500, categories: 3, lastUpdated: '2025-11-06'}
]



export default function Dashboard() {
  return (
    <section>
      <h2>Projects</h2>
      <p>Current Projects</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {mockProjects.map(p => (
          <article key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <h3>{p.name}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><strong>Items:</strong> {p.items}</li>
              <li><strong>Categories:</strong> {p.categories}</li>
              <li><strong>Last updated:</strong> {p.lastUpdated}</li>
            </ul>
            <button style={{ marginTop: 8 }}>Open Project</button>
          </article>
        ))}
      </div>
    </section>
  );
}
