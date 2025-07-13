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
import Checkout from './pages/Checkout';
import Cotizar from './pages/Cotizar';
import ProductDetail from './pages/ProductDetail.tsx';

import Navbar from './components/Navbar';

import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './img/puertas/1.png';
import './img/puertas/2.jpeg';
import './img/puertas/3.jpeg';
import './img/puertas/4.jpeg';
import './img/puertas/5.jpeg';
import './img/molduras/m1.jpg';
import './img/molduras/m2.jpeg';
import './img/molduras/m3.jpg';  

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
  
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const mockProducts: Product[] = [
      { id: 1, nombre: 'Puerta Geno Enchape Wenge', precio: 105000, imagen: '1.png', categoria: 'puertas', quantity: 10 },
      { id: 2, nombre: 'Puerta Moderna Vidrio', precio: 210000, imagen: '2.jpeg', categoria: 'puertas', quantity: 5 },
      { id: 3, nombre: 'Moldura Roble 2m', precio: 45000, imagen: 'm1.jpg', categoria: 'molduras', quantity: 8 },
      { id: 4, nombre: 'Marco Roble Sólido', precio: 75000, imagen: 'm2.jpeg', categoria: 'molduras', quantity: 12 },
      { id: 5, nombre: 'Puerta Seguridad Acero', precio: 320000, imagen: '3.jpeg', categoria: 'puertas', quantity: 7 },
      { id: 6, nombre: 'Moldura Blanca Moderna', precio: 38000, imagen: 'm3.jpg', categoria: 'molduras', quantity: 15 },
    ];

    setProducts(mockProducts);
    
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Función para agregar al carrito con actualización de stock
  const addToCart = (product: Product) => {
    if (product.quantity > 0) {
      // Actualizar stock
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
      
      // Agregar al carrito
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
    }
  };

  // Función para eliminar del carrito y devolver stock
  const removeFromCart = (productId: number, quantity: number) => {
    // Devolver stock
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, quantity: p.quantity + quantity } : p
      )
    );
    
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
              products={products}
              addToCart={addToCart} 
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