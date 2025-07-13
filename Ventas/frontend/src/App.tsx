import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login'
import VerifiedEmail from './pages/VerifiedEmail';
import ProfilePage from './pages/ProfilePage';
import Productos from './pages/Productos';
import AboutUs from './pages/AboutUs';
import Checkout from './pages/Checkout';
import Cotizar from './pages/Cotizar';
import ProductDetail from './pages/ProductDetail.tsx';

import Navbar from './components/Navbar'

import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";
import { getUserProfile } from './services/userService.ts';
import { TokenService } from './services/tokenService';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Inicializar el servicio de tokens
    TokenService.initialize();

    // Escuchar eventos de expiración de token
    const handleTokenExpired = () => {
      setUser(null);
      console.log('🔓 Sesión expirada automáticamente');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    // Cargar perfil de usuario si hay token válido
    if (TokenService.isTokenValid()) {
      getUserProfile()
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, []);

  const handleLogout = async () => {
    await TokenService.logoutFromBackend();
    setUser(null);
  };



  return (
    <>
      {!shouldHideNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<Login setUser={setUser} />} />        
        <Route path="/verified-email" element={<VerifiedEmail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
}

export default App;