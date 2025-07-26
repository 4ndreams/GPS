import React, { useEffect, useState } from "react";
import axios from "axios";
import "@styles/productManagement.css";
import ModalProduct from "./ModalProduct";
import ConfirmModal from "./ConfirmModal";

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductManagement({ userRole, token }: Props) {
  const [products, setProducts] = useState<Product[]>([]) ;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ProductData | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{id: number, name: string} | null>(null);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, axiosConfig);
      setProducts(res.data.data);
      setError("");
    } catch (e) {
      setError("Error al cargar productos");
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
  console.log("tipos:", tipos);
  console.log("materiales:", materiales);

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Guardar producto (crear o editar)
  const handleSaveProduct = async (productData: ProductData) => {
    try {
      const parsedProduct: Product = {
        ...productData,
        precio: Number(productData.precio),
        stock: Number(productData.stock),
        id_material: Number(productData.id_material),
        id_tipo: Number(productData.id_tipo),
      };
      if (productData.id_producto) {
        await axios.patch(
          `${API_BASE_URL}/products/${productData.id_producto}`,
          parsedProduct,
          axiosConfig
        );
      } else {
        await axios.post(`${API_BASE_URL}/products`, parsedProduct, axiosConfig);
      }
      fetchProducts();
      closeModal();
    } catch {
      setError("Error al guardar producto");
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleDeleteClick = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/products/${productToDelete.id}`, axiosConfig);
      fetchProducts();
      setProductToDelete(null);
    } catch {
      setError("Error al eliminar producto");
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-management">
      <h2 className="pm-title">Panel de Gestión de Productos</h2>

      <div className="pm-form">
        <button
          type="button"
          onClick={openCreateModal}
          disabled={tipos.length === 0 || materiales.length === 0}
        >
          Crear nuevo producto
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
                <button className="edit-btn" onClick={() => openEditModal(p)}>
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(p.id_producto!, p.nombre_producto)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="pm-item">
            <p>No hay productos disponibles.</p>
          </li>
        )}
      </ul>

      {isModalOpen && editData && (
        <ModalProduct
          isOpen={isModalOpen}
          editData={editData}
          tipos={tipos}
          materiales={materiales}
          onChange={handleChange}
          onClose={closeModal}
          onSubmit={handleSaveProduct}
          loadingTipos={tipos.length === 0}
          loadingMateriales={materiales.length === 0}
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
