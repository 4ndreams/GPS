import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Productos.css';
import '../img/puertas/1.png';
import '../img/puertas/2.jpeg';
import '../img/puertas/3.jpeg';
import '../img/puertas/4.jpeg';
import '../img/puertas/5.jpeg';
import '../img/molduras/m1.jpg';
import '../img/molduras/m2.jpeg';
import '../img/molduras/m3.jpg';  

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
}

interface ProductosProps {
  addToCart: (product: Product) => void;
}

function Productos({ addToCart }: ProductosProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de prueba con stock inicial
  useEffect(() => {
    const mockProducts: Product[] = [
      { id: 1, nombre: 'Puerta Geno Enchape Wenge', precio: 105000, imagen: '1.png', categoria: 'puertas', quantity: 10 },
      { id: 2, nombre: 'Puerta Moderna Vidrio', precio: 210000, imagen: '2.jpeg', categoria: 'puertas', quantity: 5 },
      { id: 3, nombre: 'Moldura Roble 2m', precio: 45000, imagen: 'm1.jpg', categoria: 'molduras', quantity: 8 },
      { id: 4, nombre: 'Marco Roble Sólido', precio: 75000, imagen: 'm2.jpeg', categoria: 'molduras', quantity: 12 },
      { id: 5, nombre: 'Puerta Seguridad Acero', precio: 320000, imagen: '3.jpeg', categoria: 'puertas', quantity: 7 },
      { id: 6, nombre: 'Moldura Blanca Moderna', precio: 38000, imagen: 'm3.jpg', categoria: 'molduras', quantity: 15 },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  const validatePrices = () => {
    if (minPrice && maxPrice) {
      const min = Number(minPrice);
      const max = Number(maxPrice);
      
      if (min > max) {
        setPriceError('El precio mínimo no puede ser mayor al máximo');
        return false;
      }
    }
    setPriceError('');
    return true;
  };

  useEffect(() => {
    if (!validatePrices()) return;

    let result = products;
    
    if (nameFilter) {
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min) && min > 0) {
        result = result.filter(p => p.precio >= min);
      }
    }
    
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max) && max > 0) {
        result = result.filter(p => p.precio <= max);
      }
    }
    
    if (categoryFilter !== 'todos') {
      result = result.filter(p => 
        p.categoria.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredProducts(result);
  }, [nameFilter, minPrice, maxPrice, categoryFilter, products]);

  // Función para manejar agregar al carrito con validación de stock
  const handleAddToCart = (product: Product) => {
    if (product.quantity > 0) {
      // Actualizar el stock localmente
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
      
      // Agregar al carrito
      addToCart(product);
    }
  };

  const clearFilters = () => {
    setNameFilter('');
    setMinPrice('');
    setMaxPrice('');
    setCategoryFilter('todos');
    setPriceError('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="productos-page">
      <div className="productos-header">
        <h1 className="main-title">Nuestros Productos</h1>
        
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Buscar por nombre:<input
              type="text"
              placeholder="Ej: Puerta Roble..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            </label>
          </div>
          
          <div className="price-range-group">
            <div className="filtro-group">
              <label>Precio mínimo($):<input
                type="number"
                placeholder="Ej: $50000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="price-input"
              />
              </label>
            </div>
            
            <div className="filtro-group">
              <label>Precio máximo($):<input
                type="number"
                placeholder="Ej: $200000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min={minPrice || "0"}
                className="price-input"
              />
              </label>
            </div>
            
            {priceError && (
              <div className="price-error-message">
                {priceError}
              </div>
            )}
          </div>
          
          <div className="filtro-group">
            <label>Categoría:
              <br/>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="categoria-select"
              >
                <option value="todos">Todos</option>
                <option value="puertas">Puertas</option>
                <option value="molduras">Molduras</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="productos-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="producto-card">
              <div className="producto-imagen-container">
                <div className="producto-categoria-badge">
                  {product.categoria.toUpperCase()}
                </div>
                {product.quantity <= 0 && (
                  <div className="producto-agotado">
                    AGOTADO
                  </div>
                )}
                <img 
                  src={`../src/img/${product.categoria}/${product.imagen}`} 
                  alt={product.nombre} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/puertas/default.jpeg';
                  }}
                  className={product.quantity <= 0 ? 'img-agotada' : ''}
                />
              </div>
              <div className="producto-info">
                <h3>{product.nombre}</h3>
                <p className="producto-precio">
                  ${product.precio.toLocaleString('es-CL')}
                </p>
                <p className="producto-stock">
                  {product.quantity > 0 
                    ? `Disponibles: ${product.quantity}` 
                    : 'Producto no disponible'}
                </p>
                <div className="producto-acciones">
                  <button 
                    className={`add-to-cart-btn ${product.quantity <= 0 ? 'disabled' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    {product.quantity > 0 
                      ? <><i className="bi bi-cart-plus"></i> Agregar al carrito</>
                      : 'Sin stock'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-resultados">
            <p>No se encontraron productos con los filtros seleccionados</p>
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;