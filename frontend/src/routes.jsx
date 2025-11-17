import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CategorySelection from './pages/CategorySelection.jsx';
import ItemCatalogue from './pages/ItemCatalogue.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import AddItem from './pages/AddItem.jsx';
import ProjectCatalogue from './pages/ProjectCatalogue.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'catalogue/:projectId', element: <ProjectCatalogue /> },
      { path: 'categories/new/:projectId', element: <CategorySelection /> },
      { path: 'item_Cat/:projectId/:categoryId', element: <ItemCatalogue /> },
      { path: 'item_detail/:itemId', element: <ItemDetail /> },
      { path: 'items/new/:projectId/:categoryId', element: <AddItem /> },
    ]
  }
]);

export default routes;



