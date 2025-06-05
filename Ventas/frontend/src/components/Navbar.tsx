import { Link } from 'react-router-dom';
import logo from '../assets/LogoTerPlac.svg';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="logo-navbar" />
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Inicio</Link>
          </li>
          <li>
            <Link to="/productos" className="navbar-link">Productos</Link>
          </li>
          <li>
            <Link to="/acerca-de" className="navbar-link">Acerca de</Link>
          </li>
          <li>
            <Link to="/contacto" className="navbar-link">Contacto</Link>
          </li>
          <li>
            <Link to="/cotizar" className="navbar-link">Cotizar</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;