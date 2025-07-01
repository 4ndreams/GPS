import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import AlertasPage from './pages/AlertasPage';
import GraficosPage from './pages/GraficosPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="alertas" element={<AlertasPage />} />
        <Route path="graficos" element={<GraficosPage />} />
      </Route>
    </Routes>
  );
}
