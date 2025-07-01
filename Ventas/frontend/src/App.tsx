import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserProfile } from './services/userService.ts';

import Home from './pages/Home';
import Register from './pages/Register';
import Error404 from './pages/Error404';
import Login from './pages/Login';
import VerifiedEmail from './pages/VerifiedEmail';
import ProfilePage from './pages/ProfilePage';
import Productos from './pages/Productos';
import AboutUs from './pages/AboutUs';
import Carrito from './pages/Carrito';

import Navbar from './components/Navbar';

import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
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

  
  useEffect(() => {
    getUserProfile()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
        
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
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
        <Route 
          path="/productos" 
          element={<Productos addToCart={addToCart} />} 
        />
        <Route 
          path="/carrito" 
          element={<Carrito />} 
        />
      </Routes>
    </>
  );
}

export default App;