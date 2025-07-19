import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserProfile } from './services/userService.ts';
import { TokenService } from './services/tokenService.ts';

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

import Navbar from './components/Navbar';

import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    
    
    // Cargar carrito guardado
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Cargar perfil de usuario
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = async () => {
    // Usar el servicio de tokens para cerrar sesión correctamente
    await TokenService.logoutFromBackend();
    setUser(null);
  };

  // Función para eliminar del carrito
  const removeFromCart = (productId: number) => {
    // Eliminar del carrito
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Función para actualizar cantidad en el carrito
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity, 
    0
  );

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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cotizar" element={<Cotizar />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route 
          path="/productos" 
          element={
            <Productos 
               
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