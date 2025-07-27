import React, { useEffect, useState } from "react";
import axios from "axios";
import "@styles/productManagement.css";
import ModalProduct from "./ModalProduct";

interface Tipo {
  id_tipo: number;
  nombre_tipo: string;
}

interface Material {
  id_material: number;
  nombre_material: string;
}

interface Product {
  id_producto?: number;
  nombre_producto: string;
  precio: number;
  stock: number;
  descripcion?: string;
  medida_ancho: string;
  medida_largo: string;
  medida_alto: string;
  id_material: number;
  id_tipo: number;
  tipo?: Tipo;
  material?: Material;
}

interface Props {
  userRole: string;
  token: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductManagement({ userRole, token }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products/all`, axiosConfig);
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
      setTipos(resTipos.data);
      setMateriales(resMateriales.data);
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

  const openCreateModal = () => {
    setEditData({
      nombre_producto: "",
      precio: 0,
      stock: 0,
      descripcion: "",
      medida_ancho: "",
      medida_largo: "",
      medida_alto: "",
      id_material: materiales[0]?.id_material || 1,
      id_tipo: tipos[0]?.id_tipo || 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditData(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleSaveProduct = async (productData: Product) => {
    try {
      if (editData && editData.id_producto) {
        await axios.patch(
          `${API_BASE_URL}/products/${editData.id_producto}`,
          productData,
          axiosConfig
        );
      } else {
        await axios.post(`${API_BASE_URL}/products`, productData, axiosConfig);
      }
      fetchProducts();
      closeModal();
    } catch {
      setError("Error al guardar producto");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === "precio" || name === "stock" ? Number(value) : value,
    });
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, axiosConfig);
      fetchProducts();
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
        <button type="button" onClick={openCreateModal}>
          Crear nuevo producto
        </button>
      </div>

      <ul className="pm-list">
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
                  onClick={() => handleDeleteProduct(p.id_producto!)}
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
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

export default ProductManagement;
