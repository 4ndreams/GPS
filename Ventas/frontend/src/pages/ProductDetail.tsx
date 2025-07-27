import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { isCurrentUserAdmin } from "@services/authService";
import { updateProduct } from "@services/productService";
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
  imagenes?: Array<{
    id_img: number;
    ruta_imagen: string;
    id_producto: number;
    createdAt: string;
    updatedAt: string;
  }>;
}


interface ProductDetailProps {
  getCartItemQuantity: (productId: number) => number;
  addToCart: (item: {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
    stock: number;
    quantity: number;
  }) => void;
}

const ProductDetail = ({ addToCart, getCartItemQuantity }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ precio: 0, stock: 0 });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        );
        setProducto(res.data.data);
        // Inicializar el formulario de edición con los valores actuales
        setEditForm({
          precio: res.data.data.precio,
          stock: res.data.data.stock
        });
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const adminStatus = await isCurrentUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error verificando rol de admin:", error);
        setIsAdmin(false);
      }
    };

    fetchProducto();
    checkAdminStatus();
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
      imagen: producto.imagenes && producto.imagenes.length > 0 
        ? producto.imagenes[0].ruta_imagen 
        : "/img/puertas/default.jpeg",
      categoria: producto.tipo?.nombre_tipo || "otros",
      stock: producto.stock ?? 0,
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

  // Funciones para edición de producto (solo administradores)
  const handleEditToggle = () => {
    if (!isEditing) {
      // Al abrir edición, inicializar con valores actuales
      setEditForm({
        precio: producto?.precio,
        stock: producto?.stock
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async () => {
    if (!producto) return;
    
    try {
      setUpdating(true);
      await updateProduct(producto.id_producto, {
        precio: editForm.precio,
        stock: editForm.stock
      });
      
      // Actualizar el estado local del producto
      setProducto(prev => prev ? {
        ...prev,
        precio: editForm.precio,
        stock: editForm.stock
      } : null);
      
      setIsEditing(false);
      alert("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error actualizando producto:", error);
      alert("Error al actualizar el producto. Verifica que tengas permisos de administrador.");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    // Restaurar valores originales
    setEditForm({
      precio: producto?.precio,
      stock: producto?.stock
    });
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
              producto.imagenes && producto.imagenes.length > 0
                ? producto.imagenes[0].ruta_imagen
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
          
          {/* Panel de edición para administradores */}
          {isAdmin && (
            <div style={{ 
              background: "#f8f9fa", 
              padding: "20px", 
              borderRadius: "8px", 
              border: "2px solid #e53935",
              marginBottom: "20px" 
            }}>
              <h3 style={{ color: "#e53935", marginBottom: "15px" }}>
                🔧 Panel de Administrador
              </h3>
              
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  style={{
                    background: "#e53935",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  ✏️ Editar Precio y Stock
                </button>
              ) : (
                <div>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Precio:
                    </label>
                    <input
                      type="number"
                      value={editForm.precio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, precio: Number(e.target.value) }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "16px"
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                      Stock:
                    </label>
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "16px"
                      }}
                      min="0"
                    />
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleEditSubmit}
                      disabled={updating}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: updating ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        opacity: updating ? 0.7 : 1
                      }}
                    >
                      {updating ? "⏳ Guardando..." : "💾 Guardar"}
                    </button>
                    
                    <button
                      onClick={handleEditCancel}
                      disabled={updating}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: updating ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        opacity: updating ? 0.7 : 1
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
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
