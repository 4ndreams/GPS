import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getImagePath } from "@utils/getImagePath";
import "@styles/Productos.css";


interface Product {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen?: string;
  tipo?: { nombre_tipo: string };
  stock?: number;
}


interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
}

interface ProductosProps {
  addToCart: (product: CartItem) => void;
  getCartItemQuantity: (productId: number) => number;
}


function Productos({ addToCart, getCartItemQuantity }: ProductosProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [priceError, setPriceError] = useState("");



  useEffect(() => {
    const validatePrices = () => {
      if (minPrice && maxPrice) {
        const min = Number(minPrice);
        const max = Number(maxPrice);
        if (min > max) {
          setPriceError("El precio mínimo no puede ser mayor al máximo");
          return false;
        }
      }
      setPriceError("");
      return true;
    };

    const fetchProducts = async () => {
      if (!validatePrices()) return;
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/`, {
          params: {
            nombre: nameFilter || undefined,
            minPrecio: minPrice || undefined,
            maxPrecio: maxPrice || undefined,
            categoria: categoryFilter !== "todos" ? categoryFilter : undefined,
          },
        });
        // Validar que la respuesta tenga la estructura esperada
        const productsData = response.data?.data;
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn('La respuesta de la API no tiene el formato esperado:', response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("Error al cargar productos");
        setProducts([]); // Asegurar que products sea un array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [nameFilter, minPrice, maxPrice, categoryFilter]);

  const clearFilters = () => {
    setNameFilter("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryFilter("todos");
    setPriceError("");
  };

  const handleAddToCart = (product: Product) => {
    const enCarrito = getCartItemQuantity(product.id_producto);
    if (enCarrito < (product.stock ?? 0)) {
      addToCart({
        id: product.id_producto,
        nombre: product.nombre_producto,
        precio: product.precio,
        imagen: product.imagen || "default.jpeg",
        categoria: product.tipo?.nombre_tipo || "otros",
        quantity: 1,
      });
    }
  };


  return (
    <div className="productos-page">
      <div className="productos-header">
        <h1 className="main-title">Nuestros Productos</h1>
        <div className="filtros-container">
          <div className="filtro-group">
            <label>
              Buscar por nombre:
              <input
                type="text"
                placeholder="Ej: Puerta Roble..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </label>
          </div>

          <div className="price-range-group">
            <div className="filtro-group">
              <label>
                Precio mínimo($):
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  className="price-input"
                />
              </label>
            </div>

            <div className="filtro-group">
              <label>
                Precio máximo($):
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min={minPrice || "0"}
                  className="price-input"
                />
              </label>
            </div>

            {priceError && <div className="price-error-message">{priceError}</div>}
          </div>

          <div className="filtro-group">
            <label>
              Categoría:
              <br />
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
        {(() => {
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
          if (!products || products.length === 0) {
            return (
              <div className="no-resultados">
                <p>No se encontraron productos con los filtros seleccionados</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Limpiar todos los filtros
                </button>
              </div>
            );
          }
          return Array.isArray(products) ? products.map((product) => {
            const tipo = product.tipo?.nombre_tipo || "otros";
            const stockDisponible = product.stock ?? 0;
            const enCarrito = getCartItemQuantity(product.id_producto);
            const agotado = stockDisponible - enCarrito <= 0;
            return (
              <div key={product.id_producto} className="producto-card">
                <Link to={`/product/${product.id_producto}`} className="producto-link">
                  <div className="producto-imagen-container">
                    <div className="producto-categoria-badge">{tipo.toUpperCase()}</div>
                    <img
                      src={getImagePath(`${tipo}/${product.imagen}`)}
                      alt={product.nombre_producto}
                      className={agotado ? 'img-agotada' : ''}
                      onError={(e) => {
                        e.currentTarget.src = "/img/puertas/default.jpeg";
                      }}
                    />
                  </div>
                  <div className="producto-info">
                    <h3>{product.nombre_producto}</h3>
                    <p className="producto-precio">
                      ${Number(product.precio).toLocaleString("es-CL")}
                    </p>
                    <p className="producto-stock">
                      Stock disponible: {stockDisponible - enCarrito}
                    </p>
                  </div>
                </Link>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={agotado}
                  style={{ marginTop: 8, width: '100%', cursor: agotado ? 'not-allowed' : 'pointer' }}
                >
                  {agotado ? 'Sin stock' : 'Agregar al carrito'}
                </button>
              </div>
            );
          }) : [];
        })()}
      </div>
    </div>
  );
}

export default Productos;