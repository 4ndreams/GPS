import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "@styles/productManagement.css";
import ModalProduct from "./ModalProduct";
import ConfirmModal from "./ConfirmModal";
import Notification from "./Notification";

interface Tipo {
  id_tipo: number;
  nombre_tipo: string;
}

interface Material {
  id_material: number;
  nombre_material: string;
}

// Usar ProductData para el formulario/modal
interface ProductData {
  id_producto?: number;
  nombre_producto: string;
  precio: string | number;
  stock: string | number;
  descripcion?: string;
  medida_ancho: string;
  medida_largo: string;
  medida_alto: string;
  id_material: number | string;
  id_tipo: number | string;
}

// Product para la lista
interface Product extends ProductData {
  tipo?: Tipo;
  material?: Material;
}

interface Props {
  userRole: string;
  token: string;
}


function ProductManagement({ userRole, token }: Readonly<Props>) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ProductData | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number, name: string } | null>(null);
  const [filter, setFilter] = useState("");
  const [sortStock, setSortStock] = useState<"asc" | "desc" | "none">("none");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // Eliminado imagePreview, no se usa ni se muestra preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, axiosConfig);
      setProducts(res.data.data);
    } catch (e: any) {
      const details = e?.response?.data?.details || "Error al cargar productos";
      setNotification({ message: details, type: "error" });
    }
    setLoading(false);
  };

  const fetchTiposYMateriales = async () => {
    try {
      const [resTipos, resMateriales] = await Promise.all([
        axios.get(`${API_BASE_URL}/tipos`),
        axios.get(`${API_BASE_URL}/materiales`),
      ]);
      const tiposData = Array.isArray(resTipos.data)
        ? resTipos.data
        : resTipos.data.data;
      const materialesData = Array.isArray(resMateriales.data)
        ? resMateriales.data
        : resMateriales.data.data;
      const tiposArray = Array.isArray(tiposData) ? tiposData : [];
      setTipos(tiposArray.flat().filter(Boolean));
      const materialesArray = Array.isArray(materialesData) ? materialesData : [];
      setMateriales(materialesArray.flat().filter(Boolean));
    } catch (e) {
      console.error("Error al cargar tipos o materiales", e);
    }
  };

  useEffect(() => {
    if (userRole.toLowerCase() === "administrador") {
      fetchProducts();
      fetchTiposYMateriales();
    }
  }, [userRole]);

  // LOGS para depuración
  // console.log("tipos:", tipos);
  // console.log("materiales:", materiales);

  // Crear producto
  const openCreateModal = () => {
    setEditData({
      nombre_producto: "",
      precio: "",
      stock: "",
      descripcion: "",
      medida_ancho: "",
      medida_largo: "",
      medida_alto: "",
      id_material: materiales[0]?.id_material || 1,
      id_tipo: tipos[0]?.id_tipo || 1,
    });
    setSelectedImage(null);
    // No preview
    setIsModalOpen(true);
  };

  // Editar producto
  const openEditModal = (product: Product) => {
    setEditData({
      id_producto: product.id_producto,
      nombre_producto: product.nombre_producto,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      descripcion: product.descripcion || "",
      medida_ancho: product.medida_ancho,
      medida_largo: product.medida_largo,
      medida_alto: product.medida_alto,
      id_material: product.material?.id_material ?? product.id_material,
      id_tipo: product.tipo?.id_tipo ?? product.id_tipo,
    });
    setSelectedImage(null);
    // No preview
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setSelectedImage(null);
    // No preview
  };

  // Guardar producto (crear o editar)

  const handleSaveProduct = async (productData: ProductData) => {
    try {
      const parsedProduct = {
        ...productData,
        precio: Number(productData.precio),
        stock: Number(productData.stock),
        id_material: Number(productData.id_material),
        id_tipo: Number(productData.id_tipo),
      };

      let savedProduct;
      let response;
      if (productData.id_producto) {
        response = await axios.patch(`${API_BASE_URL}/products/${productData.id_producto}`, parsedProduct, axiosConfig);
        savedProduct = { id_producto: productData.id_producto };
      } else {
        response = await axios.post(`${API_BASE_URL}/products`, parsedProduct, axiosConfig);
        savedProduct = response.data.data;
      }

      setNotification({
        message: response?.data?.details || (productData.id_producto ? "Producto actualizado correctamente" : "Producto creado correctamente"),
        type: "success"
      });

      if (selectedImage && savedProduct?.id_producto) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("id_producto", String(savedProduct.id_producto));
        try {
          const imgRes = await axios.post(`${API_BASE_URL}/imagenes`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          setNotification({ message: imgRes?.data?.details || "Imagen subida correctamente", type: "success" });
        } catch (imgErr: any) {
          setNotification({ message: imgErr?.response?.data?.details || "Error al subir imagen", type: "error" });
        }
      }

      fetchProducts();
      closeModal();
    } catch (e: any) {
      setNotification({ message: e?.response?.data?.details || "Error al guardar producto", type: "error" });
    }
  };

  // Recibe el FormData del modal y lo transforma a ProductData
  const handleModalSubmit = (formData: FormData) => {
    const productData: ProductData = {
      nombre_producto: formData.get("nombre_producto") as string,
      precio: formData.get("precio") as string,
      stock: formData.get("stock") as string,
      id_tipo: Number(formData.get("id_tipo")),
      id_material: Number(formData.get("id_material")),
      medida_ancho: formData.get("medida_ancho") as string,
      medida_largo: formData.get("medida_largo") as string,
      medida_alto: formData.get("medida_alto") as string,
      descripcion: (formData.get("descripcion") as string) || "",
    };
    if (editData?.id_producto) {
      productData.id_producto = editData.id_producto;
    }
    void handleSaveProduct(productData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file || null);
    // No preview
  };

  // Manejar cambios en el formulario

  const handleDeleteClick = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/products/${productToDelete.id}`, axiosConfig);
      setNotification({ message: res?.data?.details || "Producto eliminado correctamente", type: "success" });
      fetchProducts();
      setProductToDelete(null);
    } catch (e: any) {
      setNotification({ message: e?.response?.data?.details || "Error al eliminar producto", type: "error" });
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  // Filtrar productos por nombre
  let filteredProducts = filter.trim().length === 0
    ? products
    : products.filter((p) =>
        p.nombre_producto.toLowerCase().includes(filter.trim().toLowerCase())
      );

  // Ordenar por stock
  if (sortStock !== "none") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const stockA = Number(a.stock);
      const stockB = Number(b.stock);
      return sortStock === "asc" ? stockA - stockB : stockB - stockA;
    });
  }

  return (
    <div className="product-management" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, color: '#EC221F', margin: 0 }}>Panel de Gestión de Productos</h2>
        <button
          type="button"
          onClick={openCreateModal}
          disabled={tipos.length === 0 || materiales.length === 0}
          style={{
            background: '#EC221F', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #0001', transition: 'background 0.2s', cursor: 'pointer', whiteSpace: 'nowrap', opacity: tipos.length === 0 || materiales.length === 0 ? 0.6 : 1
          }}
        >
          Crear producto
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ minWidth: 220, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', background: '#fafbfc', fontSize: 15, outline: 'none', boxShadow: '0 1px 4px #0001' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f7', borderRadius: 8, padding: '6px 12px' }}>
          <span style={{ fontSize: 15, color: '#444', fontWeight: 500 }}>Ordenar por stock</span>
          <button
            type="button"
            onClick={() => setSortStock(sortStock === "asc" ? "none" : "asc")}
            style={{
              background: sortStock === "asc" ? '#EC221F' : '#fff',
              color: sortStock === "asc" ? '#fff' : '#222',
              border: '1.5px solid #e0e0e0',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: sortStock === "asc" ? '0 2px 8px #EC221F22' : 'none',
              transition: 'all 0.2s'
            }}
            aria-label="Ordenar stock ascendente"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => setSortStock(sortStock === "desc" ? "none" : "desc")}
            style={{
              background: sortStock === "desc" ? '#EC221F' : '#fff',
              color: sortStock === "desc" ? '#fff' : '#222',
              border: '1.5px solid #e0e0e0',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: sortStock === "desc" ? '0 2px 8px #EC221F22' : 'none',
              transition: 'all 0.2s'
            }}
            aria-label="Ordenar stock descendente"
          >
            ↓
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id_producto} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #0002', padding: 24, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180, position: 'relative', border: '1.5px solid #f2f2f2' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 4 }}>{p.nombre_producto}</div>
              <div style={{ color: '#EC221F', fontWeight: 600, fontSize: 18 }}>${Number(p.precio).toLocaleString("es-CL")}</div>
              <div style={{ color: '#555', fontSize: 15 }}>{p.stock} unidades</div>
              <div style={{ color: '#888', fontSize: 14 }}>Material: <b>{p.material?.nombre_material ?? '-'}</b></div>
              <div style={{ color: '#888', fontSize: 14 }}>Tipo: <b>{p.tipo?.nombre_tipo ?? '-'}</b></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => openEditModal(p)}
                  style={{ background: '#fff', color: '#EC221F', border: '1.5px solid #EC221F', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(p.id_producto!, p.nombre_producto)}
                  style={{ background: '#EC221F', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 18, padding: 40, background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #0001', border: '1.5px solid #f2f2f2' }}>
            No hay productos disponibles.
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalProduct
          isOpen={isModalOpen}
          editData={editData}
          tipos={tipos}
          materiales={materiales}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          loadingTipos={tipos.length === 0}
          loadingMateriales={materiales.length === 0}
          extraFields={
            <label>
              Imagen del producto:
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
            </label>
          }
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Eliminación"
        message={`¿Realmente quiere borrar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default ProductManagement;
