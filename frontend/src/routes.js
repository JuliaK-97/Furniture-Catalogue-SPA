import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CategorySelection from './pages/CategorySelection.jsx'
import ItemCatalogue from './pages/ItemCatalogue.jsx'   // unified browse + search
import ItemDetail from './pages/ItemDetail.jsx'
import AddItem from './pages/AddItem.jsx'
import ProjectCatalogue from './pages/ProjectCatalogue.jsx'
import Login from './pages/Login.jsx'
import AuditLogs from './pages/AuditLogs.jsx'
import ErrorPage from './pages/ErrorPage.jsx'

import { Route } from 'react-router-dom'

export const appRoutes = (
  <Route path="/" element={<App />}>
    {/* Epic 1: Dashboard */}
    <Route index element={<Dashboard />} />

    {/* Epic 2: Category Selection */}
    <Route path="categories/:projectId" element={<CategorySelection />} />

    {/* Epic 3: Item Catalogue (browse + search) */}
    <Route path="items" element={<ItemCatalogue />} />
    <Route path="items/:itemId" element={<ItemDetail />} />

    {/* Epic 5: Add New Item */}
    <Route path="add-item" element={<AddItem />} />

    {/* Epic 6: Project Catalogue View */}
    <Route path="catalogue/:projectId" element={<ProjectCatalogue />} />

    {/* Epic 7: Cross Cutting Features */}
    <Route path="login" element={<Login />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    <Route path="error" element={<ErrorPage />} />
  </Route>
)
