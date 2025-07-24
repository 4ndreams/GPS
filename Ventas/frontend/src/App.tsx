import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserProfile } from './services/userService.ts';
import { TokenService } from './services/tokenService.ts';
import { useCart } from './hooks/useCart.ts';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login';
import VerifiedEmail from './pages/VerifiedEmail';
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
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  
  const [user, setUser] = useState(null);
  
  // Usar el hook del carrito
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartItemQuantity,
    cartItemCount,
    clearCart,
  } = useCart();

  // Cargar perfil de usuario
  useEffect(() => {
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    // Usar el servicio de tokens para cerrar sesión correctamente
    await TokenService.logoutFromBackend();
    setUser(null);
  };

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          cartItemCount={cartItemCount} 
        />
      )}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
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
              clearCart={clearCart}
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