import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Productos.css";
import '../img/puertas/1.png';
import '../img/puertas/2.jpeg';
import '../img/puertas/3.jpeg';
import '../img/puertas/4.jpeg';
import '../img/puertas/5.jpeg';
import '../img/molduras/m1.jpg';
import '../img/molduras/m2.jpeg';
import '../img/molduras/m3.jpg'; 

interface Product {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen?: string; // Asegúrate de cómo manejas imagenes
  tipo?: { nombre_tipo: string }; // Relación con tipo (categoría)
}

function Productos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");

  const [priceError, setPriceError] = useState("");

   useEffect(() => {
    const mockProducts: Product[] = [
      { id_producto: 1, nombre_producto: 'Puerta Geno Enchape Wenge', precio: 105000, imagen: '1.png', tipo: { nombre_tipo: 'puertas' } },
      { id_producto: 2, nombre_producto: 'Puerta Moderna Vidrio', precio: 210000, imagen: '2.jpeg', tipo: { nombre_tipo: 'puertas' } },
      { id_producto: 3, nombre_producto: 'Moldura Roble 2m', precio: 45000, imagen: 'm1.jpg', tipo: { nombre_tipo: 'puertas' } },
      { id_producto: 4, nombre_producto: 'Marco Roble Sólido', precio: 75000, imagen: 'm2.jpeg', tipo: { nombre_tipo: 'puertas' } },
      { id_producto: 5, nombre_producto: 'Puerta Seguridad Acero', precio: 320000, imagen: '3.jpeg', tipo: { nombre_tipo: 'puertas' } },
      { id_producto: 6, nombre_producto: 'Moldura Blanca Moderna', precio: 38000, imagen: 'm3.jpg', tipo: { nombre_tipo: 'puertas' } },
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
        setPriceError("El precio mínimo no puede ser mayor al máximo");
        return false;
      }
    }
    setPriceError("");
    return true;
  };

  useEffect(() => {
    if (!validatePrices()) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
          {
            params: {
              nombre: nameFilter || undefined,
              minPrecio: minPrice || undefined,
              maxPrecio: maxPrice || undefined,
              categoria:
                categoryFilter !== "todos" ? categoryFilter : undefined,
            },
          }
        );

        setProducts(response.data.data);
      } catch (error) {
        setError("Error al cargar productos");
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
                  placeholder="Ej: $50000"
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
                  placeholder="Ej: $200000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min={minPrice || "0"}
                  className="price-input"
                />
              </label>
            </div>

            {priceError && (
              <div className="price-error-message">{priceError}</div>
            )}
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
                <option value="puerta">Puertas</option>
                <option value="moldura">Molduras</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="productos-grid">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => {
            const categoria = product.tipo?.nombre_tipo
              ? product.tipo.nombre_tipo.toUpperCase()
              : "OTROS";

            return (
              <div key={product.id_producto} className="producto-card">
                <div className="producto-imagen-container">
                  <div className="producto-categoria-badge">{categoria}</div>
                  <img
                    src={
                      product.tipo?.nombre_tipo && product.imagen
                        ? `../src/img/${product.tipo.nombre_tipo}/${product.imagen}`
                        : "/img/puertas/default.jpeg"
                    }
                    alt={product.nombre_producto}
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
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-resultados">
            <p>No se encontraron productos con los filtros seleccionados</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
