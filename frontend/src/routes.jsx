import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import CategorySelection from './pages/CategorySelection.jsx';
import ItemCatalogue from './pages/ItemCatalogue.jsx'; // unified browse + search
import ItemDetail from './pages/ItemDetail.jsx';
import AddItem from './pages/AddItem.jsx';
import ProjectCatalogue from './pages/ProjectCatalogue.jsx';
import Login from './pages/Login.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'login', element: <Login /> },
      { path: 'catalogue/:projectId', element: <ProjectCatalogue /> },
      { path: 'categories/new', element: <CategorySelection /> },
      { path: 'items', element: <ItemCatalogue /> },
      { path: 'items/:itemId', element: <ItemDetail /> },
      { path: 'items/new', element: <AddItem /> },
      { path: 'audit', element: <AuditLogs /> }
    ]
  }
]);

export default routes;

