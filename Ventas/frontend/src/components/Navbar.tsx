import { Link } from 'react-router-dom';
import logo from '../assets/LogoTerPlac.svg';
import '../styles/Navbar.css';

function Navbar() {
  const cartItemCount = 3; // Valor de prueba. Puedes usar contexto o props si lo necesitas dinámico


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

        <div className="navbar-icons d-flex align-items-center gap-3">
          <Link to="/carrito" className="position-relative text-dark">
            <i className="bi bi-cart"></i>
            {cartItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link to="/login" className="text-dark">
            <i className="bi bi-person"></i>
          </Link>
        </div>    
      </div>
    </nav>
  );
}

export default Navbar;