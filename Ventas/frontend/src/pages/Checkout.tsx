import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Checkout.css";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carrito simulado (o desde localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    } else {
      // aqui van los productos
      setCart([
        { id: 1, nombre: "Puerta Geno Enchape Wenge", precio: 105000, cantidad: 1 },
        { id: 3, nombre: "Moldura Roble 2m", precio: 45000, cantidad: 2 },
      ]);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="checkout-wrapper">
      {/* Left panel: Map and Pago */}
      <div className="checkout-page">
        {/* Retiro en tienda Section */}
        <section className="content-section section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Retiro</span>
              <h2 className="section-title">En tienda</h2>
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
        {/* Pago Section */}
        <section className="content-section ">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Pago</span>
              <h2 className="section-title">Plataforma de Pago</h2>
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
        <section className="content-section summary-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Carrito</span>
              <h2 className="section-title-alt">Resumen de tu compra</h2>
            </div>
            <div className="cart-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <span className="item-name">{item.nombre} (x{item.cantidad})</span>
                  <span className="item-price">${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <strong>Total:</strong> ${total.toLocaleString("es-CL")}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
