import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Carrito.css';

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

interface CarritoProps {
  cartItems: CartItem[];
  removeFromCart: (productId: number, quantity: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
}

function Carrito({ cartItems, removeFromCart, updateQuantity }: CarritoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Calcular subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.precio * item.quantity),
    0
  );

  // Calcular IVA (19% en Chile)
  const iva = subtotal * 0.19;

  // Calcular total
  const total = subtotal + iva;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="carrito-page">
      <h1 className="main-title">Tu Carrito de Compras</h1>
      
      {cartItems.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío</p>
          <Link to="/productos" className="btn-continuar">
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <div className="carrito-items">
            {cartItems.map(item => (
              <div key={item.id} className="carrito-item">
                <div className="item-imagen">
                  <img 
                    src={`../src/img/${item.categoria}/${item.imagen}`} 
                    alt={item.nombre} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/puertas/default.jpeg';
                    }}
                  />
                </div>
                
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p className="item-precio">
                    ${item.precio.toLocaleString('es-CL')}
                  </p>
                  
                  <div className="item-cantidad">
                    <button 
                      onClick={() => {
                        updateQuantity(item.id, item.quantity - 1);
                      }}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => {
                        const productStock = products.find(p => p.id === item.id)?.quantity || 0;
                        if(productStock>0){
                          updateQuantity(item.id, item.quantity + 1);
                        }
                      }}
                      disabled={products.find(p => p.id === item.id)?.quantity === 0}
                    >
                      +
                      </button>
                  </div>
                  
                  <p className="item-total">
                    Total: ${(item.precio * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
                
                <button 
                  className="item-eliminar"
                  onClick={() => removeFromCart(item.id, item.quantity)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="carrito-resumen">
            <h2>Resumen de Compra</h2>
            
            <div className="resumen-linea">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            
            <div className="resumen-linea">
              <span>IVA (19%):</span>
              <span>${iva.toLocaleString('es-CL')}</span>
            </div>
            
            <div className="resumen-linea total">
              <span>Total:</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
            
            <div className="resumen-acciones">
              <Link to="/productos" className="btn-continuar">
                Seguir comprando
              </Link>
              
              <Link to="/checkout" className="btn-pagar">
                Proceder al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;