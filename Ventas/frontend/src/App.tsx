import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { getUserProfile } from './services/userService.ts';
import { TokenService } from './services/tokenService.ts';
import { useCart } from './hooks/useCart.ts';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login';
import VerifiedEmail from './pages/VerifiedEmail';
import RecoverPassword from './pages/RecoverPassword';
import ProfilePage from './pages/ProfilePage';
import Productos from './pages/Productos';
import AboutUs from './pages/AboutUs';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Cotizar from './pages/Cotizar';
import ProductDetail from './pages/ProductDetail.tsx';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';

import Navbar from './components/Navbar';

import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbarRoutes = ["/login", "/register", "/recover-password"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  
  const [user, setUser] = useState(null);

  // Ref para la sección de contacto
  const contactoRef = useRef<HTMLElement>(null);
  // Estado para saber si se debe hacer scroll a contacto después de navegar
  const [pendingScrollToContacto, setPendingScrollToContacto] = useState(false);
  
  // Usar el hook del carrito
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartItemQuantity,
    cartItemCount,
  } = useCart();

  // Cargar perfil de usuario
  useEffect(() => {
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // Efecto para hacer scroll cuando sea necesario
  useEffect(() => {
    if (pendingScrollToContacto && location.pathname === "/") {
      setTimeout(() => {
        if (contactoRef.current) {
          contactoRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          // fallback por id
          const contacto = document.getElementById('contacto');
          if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
        }
        setPendingScrollToContacto(false);
      }, 100); // pequeño delay para asegurar render
    }
  }, [pendingScrollToContacto, location]);

  const handleLogout = async () => {
    // Usar el servicio de tokens para cerrar sesión correctamente
    await TokenService.logoutFromBackend();
    setUser(null);
  };

  // Función para manejar click en Contacto
  const handleContactoClick = () => {
    if (location.pathname === "/") {
      // Ya estamos en home, solo hacer scroll
      if (contactoRef.current) {
        contactoRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
        const contacto = document.getElementById('contacto');
        if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navegar a home y luego hacer scroll
      setPendingScrollToContacto(true);
      navigate('/');
    }
  };

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          cartItemCount={cartItemCount} 
          onContactoClick={handleContactoClick}
        />
      )}
      <Routes>
        <Route path="/" element={<Home ref={contactoRef} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/verified-email" element={<VerifiedEmail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              cartItems={cartItems}
            />
          } 
        />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-pending" element={<PaymentPending />} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} getCartItemQuantity={getCartItemQuantity} />} />
        <Route 
          path="/productos" 
          element={
            <Productos 
              addToCart={addToCart}
              getCartItemQuantity={getCartItemQuantity}
            />
          } 
        />
        <Route 
          path="/carrito" 
          element={
            <Carrito 
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateCartItemQuantity}
            />
          } 
        />
      </Routes>
    </>
  );
}

export default App;