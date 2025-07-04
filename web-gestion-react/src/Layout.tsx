
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

export default function Layout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-6">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
