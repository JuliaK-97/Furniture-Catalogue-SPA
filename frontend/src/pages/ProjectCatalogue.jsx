import { useParams, useSearchParams } from 'react-router-dom';

export default function ProjectCatalogue() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div>
      <h1>Project Catalogue: {projectId}</h1>
      <p>Status: {mode === 'readonly' ? 'Read-only' : 'Editable'}</p>
      <p><em>Placeholder for Epic 6: Project Catalogue View</em></p>
    </div>
  );
}

