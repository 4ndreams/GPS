import { Link } from 'react-router-dom';

import '@styles/Carrito.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
  stock?: number; // Agregar stock opcional
}

interface CartItem extends Product {
  quantity: number;
  stock: number; // Stock disponible del producto
}

interface CarritoProps {
  readonly cartItems: CartItem[];
  readonly removeFromCart: (productId: number) => void;
  readonly updateQuantity: (productId: number, newQuantity: number) => void;
}

function Carrito({ cartItems, removeFromCart, updateQuantity }: CarritoProps) {
  // Calcular total
  const total = cartItems.reduce(
    (total, item) => total + ((item.precio || 0) * (item.quantity || 0)),
    0
  );

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
                    src={item.imagen} 
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
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity || 0}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Mostrar información de stock */}
                  <p className="stock-info">
                    Stock disponible: {item.stock}
                    {item.quantity >= item.stock && (
                      <span className="stock-warning"> (Máximo alcanzado)</span>
                    )}
                  </p>
                  
                  <p className="item-total">
                    Total: ${(item.precio * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
                
                <button 
                  className="item-eliminar"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="carrito-resumen">
            <h2>Resumen de Compra</h2>
            
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