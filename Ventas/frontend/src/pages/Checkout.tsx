import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../services/userService";
import "../styles/Checkout.css";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  quantity: number;
}

interface ContactInfo {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar carrito y perfil de usuario
  useEffect(() => {
    const loadCartAndProfile = async () => {
      try {
        // Cargar carrito desde localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          
          // Validar formato del carrito
          if (Array.isArray(parsedCart)){
            const isValidCart = parsedCart.every(item => 
              item.id && item.nombre && item.precio && item.quantity
            );
            
            if (isValidCart) {
              setCart(parsedCart);
            } else {
              console.error("Formato de carrito inválido");
              setCart([]);
            }
          }
        }

        // Cargar información del usuario
        await loadUserProfile();
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartAndProfile();
  }, []);

  // Escuchar cambios en el carrito desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userData = await getUserProfile();
      setContactInfo({
        nombre: userData.nombre || "",
        apellidos: userData.apellidos || "",
        email: userData.email || "",
        telefono: userData.telefono || "",
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error al obtener perfil del usuario:', error);
      setIsLoggedIn(false);
    }
  };

  // Manejar cambios en los campos de contacto
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart-message">
        <h2>Tu carrito está vacío</h2>
        <p>No hay productos para mostrar en el checkout</p>
        <Link to="/productos" className="continue-shopping-btn">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <div className="checkout-wrapper">
      {/* Left panel: Contact, Pickup and Payment */}
      <div className="checkout-page">
        {/* Paso 1: Información de Contacto Section */}
        <section className="content-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Paso 1</span>
              <h2 className="section-title">Información de Contacto</h2>
            </div>
            <div className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={contactInfo.nombre}
                    onChange={handleContactChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={contactInfo.apellidos}
                    onChange={handleContactChange}
                    placeholder="Tus apellidos"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    placeholder="Tu correo electrónico"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={contactInfo.telefono}
                    onChange={handleContactChange}
                    placeholder="Tu número de teléfono"
                    required
                  />
                </div>
              </div>
              {!isLoggedIn && (
                <p className="login-suggestion">
                  💡 <Link to="/login">Inicia sesión</Link> para autocompletar estos campos automáticamente, además podrás ver el historial y estado de tus compras en tu perfil
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Paso 2: Retiro en tienda Section */}
        <section className="content-section section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Paso 2</span>
              <h2 className="section-title">Retiro en Tienda</h2>
            </div>
            <div className="pickup-info">
              <div className="no-delivery-notice">
                <div className="notice-icon">
                  <i className="bi bi-info-circle"></i>
                </div>
                <div className="notice-content">
                  <h3>Solo Retiro en Tienda</h3>
                  <p>Actualmente no contamos con servicio de despacho a domicilio. Todos los productos deben ser retirados directamente en nuestra tienda.</p>
                </div>
              </div>
              <div className="store-info">
                <h4>Ubicación de la Tienda</h4>
                <p><strong>Dirección:</strong> Lincoyan 880 - Concepción</p>
                <p><strong>Horarios de Atención:</strong> Lunes a Viernes 9:00 -  - 18:00</p>
                <p><strong>Teléfono:</strong> +56984184801 / 412223967</p>
              </div>
            </div>
            <div className="map-container">
              <iframe
                title="Mapa de tienda"
                src="https://maps.google.com/maps?q=-36.82381573532668,-73.05604157301508&hl=es&z=15&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
        
        {/* Paso 3: Pago Section */}
        <section className="content-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Paso 3</span>
              <h2 className="section-title">Pago</h2>
            </div>
            <div className="payment-link">
              <Link
                to={`https://checkout.example.com?amount=${total}`}
                className="checkout-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pagar con WebPay
              </Link>
            </div>
          </div>
        </section>
      </div>
      {/* panel derecho: */}
      <div className="checkout-page-alt">
        <section className="content-section-alt summary-section">
          <div className="container">
            <div className="summary-card">
              <div className="section-header">
                <span className="section-badge">Carrito</span>
                <h2 className="section-title-alt">Resumen de tu compra</h2>
              </div>
              <div className="cart-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span className="item-name">{item.nombre} (x{item.quantity})</span>
                    <span className="item-price">${(item.precio * item.quantity).toLocaleString("es-CL")}</span>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total:</strong> ${total.toLocaleString("es-CL")}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
