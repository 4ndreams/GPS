import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_terplac.svg';
import logoMobile from '../assets/TERPLAC_T.png';
import '../styles/Navbar.css';

type User = {
  nombre: string;
  apellidos: string;
  email: string;
} | null;

interface NavbarProps {
  readonly user: User;
  readonly onLogout?: () => void;
  readonly cartItemCount: number;
}

function Navbar({ user, onLogout, cartItemCount }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false); 
  const [userMenuOpen, setUserMenuOpen] = useState(false); 
  const userMenuRef = useRef<HTMLDivElement>(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img
            src={isMobile ? logoMobile : logo}
            alt="Logo"
            className="logo-navbar"
          />
        </Link>

        {/* Botón hamburguesa solo en pantallas pequeñas */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        {/* Menú de navegación */}
        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>Inicio</Link></li>
          <li><Link to="/productos" className="navbar-link" onClick={() => setIsOpen(false)}>Productos</Link></li>
          <li><Link to="/about-us" className="navbar-link" onClick={() => setIsOpen(false)}>Sobre Nosotros</Link></li>
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
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button
              className="btn btn-outline-primary d-flex align-items-center user-menu-btn"
              onClick={() => setUserMenuOpen((open) => !open)}
              type="button"
            >
              <i className="bi bi-person"></i>
              <span style={{ lineHeight: "1.1", textAlign: "left" }}>
                {user ? user.nombre : "Ingresar"}
              </span>
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Perfil
                    </Link>
                    <Link
                      to="/"
                      className="dropdown-item"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout && onLogout();
                      }}
                    >
                      Cerrar sesión
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Iniciar sesión
                    </Link>
                    <Link to="/register" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;