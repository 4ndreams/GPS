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

function Carrito() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito desde localStorage al inicio
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setLoading(false);
    } catch (err) {
      setError('Error al cargar el carrito');
      setLoading(false);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Eliminar producto del carrito y devolver stock
  const removeFromCart = (productId: number, quantity: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // Aquí deberías implementar la lógica para devolver el stock al inventario
    // Esto requeriría acceso a la función setProducts del componente Productos
    // Una solución más completa sería usar un estado global (como Redux o Context)
  };

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
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
