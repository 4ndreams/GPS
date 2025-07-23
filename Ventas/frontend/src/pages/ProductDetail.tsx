import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getImagePath } from "@utils/getImagePath";
import "@styles/ProductDetail.css";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  stock: number;
  descripcion?: string;
  medida_ancho: string;
  medida_largo: string;
  medida_alto: string;
  tipo?: { nombre_tipo: string };
  material?: { nombre_material: string };
  imagen?: string;
}


interface ProductDetailProps {
  getCartItemQuantity: (productId: number) => number;
  addToCart: (item: {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
    quantity: number;
  }) => void;
}

const ProductDetail = ({ addToCart, getCartItemQuantity }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        );
        setProducto(res.data.data);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);


  if (loading) return <p>Cargando producto...</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  // Calcular stock disponible en tiempo real usando la función del carrito
  const enCarrito = getCartItemQuantity(producto.id_producto);
  const stockDisponible = (producto.stock ?? 0) - enCarrito;
  const agotado = stockDisponible <= 0;

  // Usar la función global addToCart igual que en Productos.tsx
  const handleAddToCart = () => {
    if (!producto) return;
    addToCart({
      id: producto.id_producto,
      nombre: producto.nombre_producto,
      precio: producto.precio,
      imagen: producto.imagen || "default.jpeg",
      categoria: producto.tipo?.nombre_tipo || "otros",
      quantity: 1,
    });
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const handleBuyNow = () => {
    handleAddToCart();
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      setShowOptions(true);
    }
  };

  // Modal de opciones de compra
  const BuyOptionsModal = ({ onClose, onLogin, onGuest }: { onClose: () => void, onLogin: () => void, onGuest: () => void }) => (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
          padding: "32px 28px",
          minWidth: "320px",
          maxWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#e53935",
            cursor: "pointer"
          }}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 style={{ marginBottom: "24px", color: "#263238" }}>¿Cómo quieres continuar?</h2>
        <button className="btn-comprar" style={{ width: "100%", marginBottom: "16px" }} onClick={onLogin}>
          Iniciar sesión
        </button>
        <button
          className="btn-comprar"
          style={{ backgroundColor: "#fff", color: "#e53935", border: "2px solid #e53935", width: "100%" }}
          onClick={onGuest}
        >
          Continuar como invitado
        </button>
      </div>
    </div>
  );

  return (
    <div className="producto-detalle-container">
      <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>
      <div className="detalle-producto">
        <div className="detalle-imagen">
          <img
            src={
              producto.tipo?.nombre_tipo && producto.imagen
                ? getImagePath(`${producto.tipo.nombre_tipo}/${producto.imagen}`)
                : "/img/puertas/default.jpeg"
            }
            alt={producto.nombre_producto}
            className={agotado ? 'img-agotada' : ''}
            onError={(e) => {
              e.currentTarget.src = "/img/puertas/default.jpeg";
            }}
          />
        </div>
        <div className="detalle-info">
          <h1>{producto.nombre_producto}</h1>
          <p><strong>Precio:</strong> ${Number(producto.precio).toLocaleString("es-CL")}</p>
          <p><strong>Stock disponible:</strong> {stockDisponible}</p>
          <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción"}</p>
          <p><strong>Dimensiones:</strong> {producto.medida_ancho} x {producto.medida_largo} x {producto.medida_alto} cm</p>
          <p><strong>Tipo:</strong> {producto.tipo?.nombre_tipo}</p>
          <p><strong>Material:</strong> {producto.material?.nombre_material}</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn-comprar"
              onClick={handleBuyNow}
              disabled={agotado}
              style={agotado ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              Comprar ahora
            </button>
            <button
              className="btn-comprar"
              style={{ backgroundColor: "#fff", color: "#e53935", border: "2px solid #e53935", opacity: agotado ? 0.7 : 1, cursor: agotado ? 'not-allowed' : 'pointer' }}
              onClick={() => { if (!agotado) { handleAddToCart(); alert("Producto agregado al carrito."); } }}
              disabled={agotado}
            >
              {agotado ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
      {showOptions && (
        <BuyOptionsModal
          onClose={() => setShowOptions(false)}
          onLogin={() => { setShowOptions(false); navigate("/login"); }}
          onGuest={() => { setShowOptions(false); navigate("/checkout"); }}
        />
      )}
    </div>
  );
};

export default ProductDetail;
