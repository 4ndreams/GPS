// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-link">Inicio</NavLink>
      <NavLink to="/alertas" className="nav-link">Alertas</NavLink>
      <NavLink to="/graficos" className="nav-link">Gráficos</NavLink>
    </nav>
  );
}
