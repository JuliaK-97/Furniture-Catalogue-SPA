
import { Outlet } from 'react-router-dom';


export default function App() {
  return (
    <div style={{padding: '1rem'}}>
      <h1>Furniture Catalogue</h1>
        <Outlet />
    </div>
  );
}


