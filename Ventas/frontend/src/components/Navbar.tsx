// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoTerPlac.svg';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const cartItemCount = 3; // Reemplaza por lógica dinámica si quieres

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="logo-navbar" />
        </Link>

        {/* Botón hamburguesa solo en pantallas pequeñas */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        {/* Menú de navegación */}
        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Inicio</Link></li>
          <li><Link to="/productos" className="navbar-link" onClick={() => setIsOpen(false)}>Productos</Link></li>
          <li><Link to="/acerca-de" className="navbar-link" onClick={() => setIsOpen(false)}>Acerca de</Link></li>
          <li><Link to="/contacto" className="navbar-link" onClick={() => setIsOpen(false)}>Contacto</Link></li>
          <li><Link to="/cotizar" className="navbar-link" onClick={() => setIsOpen(false)}>Cotizar</Link></li>
        </ul>

        {/* Iconos (carrito y perfil) */}
        <div className="navbar-icons">
          <div className="cart-icon-wrapper">
            <Link to="/carrito" className="position-relative text-dark">
              <i className="bi bi-cart"></i>
              {cartItemCount > 0 && (
                <span className="cart-badge">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
          <Link to="/login" className="text-dark">
            <i className="bi bi-person"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
