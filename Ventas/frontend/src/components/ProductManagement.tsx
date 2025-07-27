import React, { useEffect, useRef, useState } from "react";
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

interface Relleno {
  id_relleno: number;
  nombre_relleno: string;
}

interface ProductData {
  id_producto?: number;
  nombre_producto: string;
  precio: string | number;
  stock: string | number;
  descripcion?: string;
  medida_ancho: string;
  medida_alto: string;
  id_material: number | string;
  id_tipo: number | string;
  id_relleno: number | string;
}

interface Product extends ProductData {
  tipo?: Tipo;
  material?: Material;
  relleno?: Relleno;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [rellenos, setRellenos] = useState<Relleno[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{  id: number, name: string  } | null>(null);
  const [filter, setFilter] = useState("");
  const [sortStock, setSortStock] = useState<"asc" | "desc" | "none">("none");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // Eliminado imagePreview, no se usa ni se muestra preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      const [resTipos, resMateriales, resRellenos] = await Promise.all([
        axios.get(`${API_BASE_URL}/tipos`),
        axios.get(`${API_BASE_URL}/materiales`),
        axios.get(`${API_BASE_URL}/rellenos`),
      ]);
      const tiposData = Array.isArray(resTipos.data) ? resTipos.data : resTipos.data.data;
      const materialesData = Array.isArray(resMateriales.data) ? resMateriales.data : resMateriales.data.data;
      const rellenosData = Array.isArray(resRellenos.data) ? resRellenos.data : resRellenos.data.data;
      setTipos(tiposData.flat().filter(Boolean));
      setMateriales(materialesData.flat().filter(Boolean));
      setRellenos(rellenosData.flat().filter(Boolean));
    } catch (e) {
      console.error("Error al cargar tipos, materiales o rellenos", e);
    }
  };

  useEffect(() => {
    if (userRole.toLowerCase() === "administrador") {
      fetchProducts();
      fetchTiposYMateriales();
    }
  }, [userRole]);

  const openCreateModal = () => {
    setEditData({
      nombre_producto: "",
      precio: "",
      stock: "",
      descripcion: "",
      medida_ancho: "",
      medida_alto: "",
      id_material: materiales[0]?.id_material || 1,
      id_tipo: tipos[0]?.id_tipo || 1,
      id_relleno: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditData({
      id_producto: product.id_producto,
      nombre_producto: product.nombre_producto,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      descripcion: product.descripcion || "",
      medida_ancho: product.medida_ancho,
      medida_alto: product.medida_alto,
      id_material: product.material?.id_material ?? product.id_material,
      id_tipo: product.tipo?.id_tipo ?? product.id_tipo,
      id_relleno: product.relleno?.id_relleno ?? product.id_relleno ?? "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSaveProduct = async (productData: ProductData) => {
    try {
      const parsedProduct = {
        ...productData,
        precio: Number(productData.precio),
        stock: Number(productData.stock),
        id_material: Number(productData.id_material),
        id_tipo: Number(productData.id_tipo),
        id_relleno: Number(productData.id_relleno),
      };

      let savedProduct;
      if (productData.id_producto) {
        await axios.patch(`${API_BASE_URL}/products/${productData.id_producto}`, parsedProduct, axiosConfig);
        savedProduct = { id_producto: productData.id_producto };
      } else {
        const res = await axios.post(`${API_BASE_URL}/products`, parsedProduct, axiosConfig);
        savedProduct = res.data.data;
      }

      if (selectedImage && savedProduct?.id_producto) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("id_producto", String(savedProduct.id_producto));

        await axios.post(`${API_BASE_URL}/imagenes`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
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

  // ✅ Este es el cambio importante:
  const handleModalSubmit = (formData: FormData) => {
    const productData: ProductData = {
      nombre_producto: formData.get("nombre_producto") as string,
      precio: formData.get("precio") as string,
      stock: formData.get("stock") as string,
      id_tipo: Number(formData.get("id_tipo")),
      id_material: Number(formData.get("id_material")),
      id_relleno: Number(formData.get("id_relleno")),
      medida_ancho: formData.get("medida_ancho") as string,
      medida_alto: formData.get("medida_alto") as string,
      descripcion: (formData.get("descripcion") as string) || "",
    };
    if (editData?.id_producto) {
      productData.id_producto = editData.id_producto;
    }
    void handleSaveProduct(productData);
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

      <ul className="pm-list pm-list-scroll">
        {products.length > 0 ? (
          products.map((p) => (
            <li className="pm-item" key={p.id_producto}>
              <h4>{p.nombre_producto}</h4>
              <p>${Number(p.precio).toLocaleString("es-CL")}</p>
              <p>{p.stock} unidades</p>
              <div>
                <button className="edit-btn" onClick={() => openEditModal(p)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(p.id_producto!, p.nombre_producto)}>Eliminar</button>
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
          rellenos={rellenos}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          loadingTipos={tipos.length === 0}
          loadingMateriales={materiales.length === 0}
          loadingRellenos={rellenos.length === 0}
          extraFields={
            <>
              <label>
                Imagen del producto:
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxHeight: "150px", marginTop: "8px" }} />}
            </>
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
