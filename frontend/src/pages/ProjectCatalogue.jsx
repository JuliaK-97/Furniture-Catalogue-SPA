import { useParams, useSearchParams } from "react-router-dom"
export default function ProjectCatalogue() {
    const { projectId } = useParams()
    const [searchParams] = useSearchParams()
    const mode = searchParams.get('mode')
  return (
    <div>
      <h1>Project Catalogue: {projectId}</h1>
      {mode === 'readonly' ? (
        <p> This project is closed. Read-only view</p>
      ): (
        <p> This project is open. You can edit or delete items</p>
      )}
    </div>
  )
}
