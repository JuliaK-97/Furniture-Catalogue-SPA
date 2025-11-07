import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CategorySelection from './pages/CategorySelection.jsx';
import ItemCatalogue from './pages/ItemCatalogue.jsx';   // unified browse + search
import ItemDetail from './pages/ItemDetail.jsx';
import AddItem from './pages/AddItem.jsx';
import ProjectCatalogue from './pages/ProjectCatalogue.jsx';
import Login from './pages/Login.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { createBrowserRouter } from "react-router-dom";

import { Route } from 'react-router-dom';


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Epic 1: Dashboard
      { index: true, element: <Dashboard /> },

      // Epic 2: Category Selection
      { path: "categories/:projectId", element: <CategorySelection /> },

      // Epic 3: Item Catalogue
      { path: "items", element: <ItemCatalogue /> },
      { path: "items/:itemId", element: <ItemDetail /> },

      // Epic 5: Add New Item
      { path: "add-item", element: <AddItem /> },

      // Epic 6: Project Catalogue View
      { path: "catalogue/:projectId", element: <ProjectCatalogue /> },

      // Epic 7: Cross Cutting Features
      { path: "login", element: <Login /> },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

export default routes;
