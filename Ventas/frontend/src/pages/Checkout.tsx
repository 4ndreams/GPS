import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "@services/userService";
import { createPaymentOrder } from "@services/paymentService";
import { getImagePath } from "@utils/getImagePath";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import "@styles/Checkout.css";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
}

interface ContactInfo {
  nombre: string;
  apellidos: string;
  email: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    nombre: "",
    apellidos: "",
    email: ""
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Inicializar Mercado Pago
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey);
    }
  }, []);

  // Cargar información del usuario si está logueado
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Función para obtener información del usuario logueado
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userData = await getUserProfile();
      setContactInfo({
        nombre: userData.nombre || "",
        apellidos: userData.apellidos || "",
        email: userData.email || ""
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

  // Manejar el proceso de pago
  const handlePayment = async () => {
    // Validar campos requeridos
    if (!contactInfo.nombre || !contactInfo.apellidos || !contactInfo.email) {
      alert('Por favor completa todos los campos de contacto antes de proceder al pago.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Crear la orden en el backend y obtener el preference_id de Mercado Pago
      const orderData = {
        contactInfo,
        items: cartItems,
        total
      };

      const response = await createPaymentOrder(orderData);
      
      if (response.success && response.preferenceId) {
        setPreferenceId(response.preferenceId);
        // El componente Wallet se renderizará automáticamente cuando preferenceId tenga valor
      } else {
        throw new Error('Error al crear la preferencia de pago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.precio * item.quantity, 0);

  // Si el carrito está vacío, mostrar mensaje
  if (cartItems.length === 0) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-page">
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos antes de proceder al checkout.</p>
            <Link to="/productos" className="btn btn-primary">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              {!preferenceId ? (
                <button
                  onClick={handlePayment}
                  className="checkout-button"
                  disabled={cartItems.length === 0 || isProcessingPayment}
                >
                  {isProcessingPayment ? 'Preparando pago...' : `Pagar con Mercado Pago - $${total.toLocaleString("es-CL")}`}
                </button>
              ) : (
                <div className="mercadopago-wallet">
                  <Wallet 
                    initialization={{ 
                      preferenceId: preferenceId,
                      redirectMode: 'self'
                    }}
                    onReady={() => {
                      console.log('Wallet listo');
                    }}
                    onError={(error: any) => {
                      console.error('Error en Mercado Pago:', error);
                      alert('Error en el proceso de pago. Por favor intenta nuevamente.');
                      setPreferenceId(null);
                    }}
                  />
                </div>
              )}
              <p className="payment-note">
                {!preferenceId 
                  ? 'Al procesar el pedido serás redirigido a Mercado Pago para completar el pago.'
                  : 'Completa tu pago con Mercado Pago de forma segura.'
                }
              </p>
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
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={getImagePath(`${item.categoria}/${item.imagen}`)} 
                        alt={item.nombre}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/img/puertas/default.jpeg';
                        }}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-quantity">Cantidad: {item.quantity}</span>
                    </div>
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
