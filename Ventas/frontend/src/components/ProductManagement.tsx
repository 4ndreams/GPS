import React, { useEffect, useRef, useState } from "react";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number, name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, axiosConfig);
      setProducts(res.data.data);
      setError("");
    } catch {
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
      const tiposData = Array.isArray(resTipos.data) ? resTipos.data : resTipos.data.data;
      const materialesData = Array.isArray(resMateriales.data) ? resMateriales.data : resMateriales.data.data;
      setTipos(tiposData.flat().filter(Boolean));
      setMateriales(materialesData.flat().filter(Boolean));
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
      medida_largo: product.medida_largo,
      medida_alto: product.medida_alto,
      id_material: product.material?.id_material ?? product.id_material,
      id_tipo: product.tipo?.id_tipo ?? product.id_tipo,
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
    } catch {
      setError("Error al guardar producto");
    }
  };

  // ✅ Este es el cambio importante:
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
                <button className="edit-btn" onClick={() => openEditModal(p)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDeleteClick(p.id_producto!, p.nombre_producto)}>Eliminar</button>
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
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          loadingTipos={tipos.length === 0}
          loadingMateriales={materiales.length === 0}
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
