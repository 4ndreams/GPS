import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import OrdenesPage from './pages/OrdenesPage';
import ReportesPage from './pages/ReportesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import AlertasPage from './pages/AlertasPage';
import GraficosPage from './pages/GraficosPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<OrdenesPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="graficos" element={<GraficosPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
