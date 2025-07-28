import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { isCurrentUserAdmin } from "@services/authService";
import { updateProduct } from "@services/productService";
import { TokenService } from "@services/tokenService";
import "@styles/ProductDetail.css";
import Notification from "../components/Notification";

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
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isDestacado, setIsDestacado] = useState(false);
  const [destacadoId, setDestacadoId] = useState<number | null>(null);
  const [destacadoLoading, setDestacadoLoading] = useState(false);

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

    const fetchDestacadoStatus = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos-destacados`);
        const destacados: Array<{ id_destacado: number; producto: Producto }> = res.data.data || [];
        const found = destacados.find((d) => d.producto?.id_producto === Number(id));
        if (found) {
          setIsDestacado(true);
          setDestacadoId(found.id_destacado);
        } else {
          setIsDestacado(false);
          setDestacadoId(null);
        }
      } catch {
        setIsDestacado(false);
        setDestacadoId(null);
      }
    };

    fetchProducto();
    checkAdminStatus();
    fetchDestacadoStatus();
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
      setNotification({ message: "Producto actualizado exitosamente", type: "success" });
    } catch (error) {
      console.error("Error actualizando producto:", error);
      setNotification({ message: "Error al actualizar el producto. Verifica que tengas permisos de administrador.", type: "error" });
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

  // Funciones para agregar/quitar destacado
  const fetchDestacadoStatus = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/productos-destacados`);
      const destacados: Array<{ id_destacado: number; producto: Producto }> = res.data.data || [];
      const found = destacados.find((d) => d.producto?.id_producto === Number(id));
      if (found) {
        setIsDestacado(true);
        setDestacadoId(found.id_destacado);
      } else {
        setIsDestacado(false);
        setDestacadoId(null);
      }
    } catch {
      setIsDestacado(false);
      setDestacadoId(null);
    }
  };

  const handleAgregarDestacado = async () => {
    if (!producto) return;
    setDestacadoLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/productos-destacados`,
        { id_producto: producto.id_producto },
        {
          headers: {
            Authorization: `Bearer ${TokenService.getToken()}`,
          },
        }
      );
      await fetchDestacadoStatus(); // Refresca estado
      alert("Producto agregado como destacado.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error al agregar producto destacado. Verifica permisos.");
      } else {
        alert("Error al agregar producto destacado. Verifica permisos.");
      }
    } finally {
      setDestacadoLoading(false);
    }
  };

  const handleEliminarDestacado = async () => {
    if (!destacadoId) return;
    setDestacadoLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/productos-destacados/${destacadoId}`,
        {
          headers: {
            Authorization: `Bearer ${TokenService.getToken()}`,
          },
        }
      );
      await fetchDestacadoStatus(); // Refresca estado
      alert("Producto eliminado de destacados.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error al eliminar producto destacado. Verifica permisos.");
      } else {
        alert("Error al eliminar producto destacado. Verifica permisos.");
      }
    } finally {
      setDestacadoLoading(false);
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
      {notification && (
        <div style={{ maxWidth: 600, margin: '0 auto 18px auto' }}>
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
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
          <div className="producto-precio">${Number(producto.precio).toLocaleString("es-CL")}</div>
          <p><strong>Stock disponible:</strong> {stockDisponible}</p>
          <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción"}</p>
          <p><strong>Dimensiones:</strong> {producto.medida_ancho} x {producto.medida_largo} x {producto.medida_alto} cm</p>

          {/* Panel de edición para administradores */}
          {isAdmin && (
            <div className="admin-panel-producto" style={{
              background: "#f8f9fa",
              padding: "24px 20px 20px 20px",
              borderRadius: "14px",
              border: "2px solid #e53935",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(44,62,80,0.07)"
            }}>
              <h3 style={{ color: "#e53935", marginBottom: "15px" }}>
                🔧 Panel de Administrador
              </h3>
              
              {/* Botón para agregar/eliminar destacado */}
              <div style={{ marginBottom: "15px" }}>
                {isDestacado ? (
                  <button
                    onClick={handleEliminarDestacado}
                    disabled={destacadoLoading}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: destacadoLoading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      marginBottom: "8px"
                    }}
                  >
                    {destacadoLoading ? "⏳ Quitando..." : "Quitar de destacados"}
                  </button>
                ) : (
                  <button
                    onClick={handleAgregarDestacado}
                    disabled={destacadoLoading}
                    style={{
                      background: "#e53935",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: destacadoLoading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      marginBottom: "8px"
                    }}
                  >
                    {destacadoLoading ? "⏳ Agregando..." : "Agregar a destacados"}
                  </button>
                )}
              </div>
              
              <h3 style={{ color: "#e53935", marginBottom: "18px", fontWeight: 700, fontSize: "1.2rem", letterSpacing: 1 }}>🔧 Panel de Administrador</h3>
              {!isEditing ? (
                <button
                  className="btn-comprar"
                  style={{ maxWidth: 220, fontSize: 15, padding: "10px 0", margin: 0 }}
                  onClick={handleEditToggle}
                >
                  ✏️ Editar Precio y Stock
                </button>
              ) : (
                <form style={{ width: "100%", marginTop: 10 }} onSubmit={e => { e.preventDefault(); handleEditSubmit(); }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="admin-precio" style={{ display: "block", marginBottom: "4px", fontWeight: 600, color: "#e53935", fontSize: 14 }}>
                      Precio:
                    </label>
                    <input
                      id="admin-precio"
                      type="number"
                      value={editForm.precio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, precio: Number(e.target.value) }))}
                      className="input-admin-producto"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        border: "1.2px solid #e0e0e0",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        background: "#fff",
                        color: "#263238",
                        maxWidth: 180
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="admin-stock" style={{ display: "block", marginBottom: "4px", fontWeight: 600, color: "#e53935", fontSize: 14 }}>
                      Stock:
                    </label>
                    <input
                      id="admin-stock"
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      className="input-admin-producto"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        border: "1.2px solid #e0e0e0",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        background: "#fff",
                        color: "#263238",
                        maxWidth: 180
                      }}
                      min="0"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginTop: 8 }}>
                    <button
                      className="btn-comprar"
                      type="submit"
                      disabled={updating}
                      style={{
                        background: updating ? "#218838" : "#28a745",
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        padding: "8px 18px",
                        borderRadius: 7,
                        opacity: updating ? 0.7 : 1,
                        cursor: updating ? "not-allowed" : "pointer",
                        transition: "background 0.18s"
                      }}
                      onMouseOver={e => { if (!updating) e.currentTarget.style.background = '#218838'; }}
                      onMouseOut={e => { if (!updating) e.currentTarget.style.background = '#28a745'; }}
                    >
                      {updating ? "⏳ Guardando..." : "💾 Guardar"}
                    </button>
                    <button
                      className="btn-comprar"
                      type="button"
                      onClick={handleEditCancel}
                      disabled={updating}
                      style={{
                        background: updating ? "#bdbdbd" : "#f1f1f1",
                        border: "1.2px solid #bdbdbd",
                        color: "#444",
                        fontWeight: 700,
                        fontSize: 14,
                        padding: "8px 18px",
                        borderRadius: 7,
                        opacity: updating ? 0.7 : 1,
                        cursor: updating ? "not-allowed" : "pointer",
                        transition: "background 0.18s"
                      }}
                      onMouseOver={e => { if (!updating) e.currentTarget.style.background = '#e0e0e0'; }}
                      onMouseOut={e => { if (!updating) e.currentTarget.style.background = '#f1f1f1'; }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
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
              onClick={() => { if (!agotado) { handleAddToCart(); setNotification({ message: "Producto agregado al carrito.", type: "success" }); } }}
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