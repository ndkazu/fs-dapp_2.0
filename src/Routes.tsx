import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './components/pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: 'dashboard', element: <Dashboard /> }],
  },
]);
export function Routes() {
  return <RouterProvider router={router} />;
}
