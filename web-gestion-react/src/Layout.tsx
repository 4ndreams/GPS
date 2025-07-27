
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

export default function Layout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-6 mt-20">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
}
