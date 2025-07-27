import React, { useEffect, useState } from "react";
import "../styles/modal.css";

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
  id_tipo: number | string;
  id_material: number | string;
  medida_ancho: string;
  medida_largo: string;
  medida_alto: string;
  descripcion?: string;
}

interface ModalProductProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  editData: ProductData | null;
  tipos: Tipo[];
  materiales: Material[];
  loadingTipos?: boolean;
  loadingMateriales?: boolean;
  extraFields?: React.ReactNode;
}

const ModalProduct: React.FC<ModalProductProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  tipos,
  materiales,
  loadingTipos = false,
  loadingMateriales = false,
  extraFields,
}) => {
  const [formData, setFormData] = useState<ProductData>({
    nombre_producto: "",
    precio: "",
    stock: "",
    id_tipo: "",
    id_material: "",
    medida_ancho: "",
    medida_largo: "",
    medida_alto: "",
    descripcion: "",
  });



  useEffect(() => {
    if (editData) {
      setFormData({
        id_producto: editData.id_producto,
        nombre_producto: editData.nombre_producto,
        precio: editData.precio,
        stock: editData.stock,
        id_tipo: editData.id_tipo || "",
        id_material: editData.id_material || "",
        medida_ancho: editData.medida_ancho || "",
        medida_largo: editData.medida_largo || "",
        medida_alto: editData.medida_alto || "",
        descripcion: editData.descripcion || "",
      });
    } else {
      setFormData({
        nombre_producto: "",
        precio: "",
        stock: "",
        id_tipo: "",
        id_material: "",
        medida_ancho: "",
        medida_largo: "",
        medida_alto: "",
        descripcion: "",
      });
    }

  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{editData && editData.id_producto ? "Editar Producto" : "Crear Producto"}</h2>
          <button className="close-btn" type="button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="modal-body">
            <label>
              Nombre
              <input
                type="text"
                name="nombre_producto"
                placeholder="Nombre"
                value={formData.nombre_producto}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Precio
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Ancho
              <input
                type="text"
                name="medida_ancho"
                placeholder="Ancho"
                value={formData.medida_ancho}
                onChange={handleChange}
              />
            </label>
            <label>
              Largo
              <input
                type="text"
                name="medida_largo"
                placeholder="Largo"
                value={formData.medida_largo}
                onChange={handleChange}
              />
            </label>
            <label>
              Alto
              <input
                type="text"
                name="medida_alto"
                placeholder="Alto"
                value={formData.medida_alto}
                onChange={handleChange}
              />
            </label>
            <label>
              Descripción
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </label>
            <label>
              Tipo
              <select
                name="id_tipo"
                value={formData.id_tipo}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona tipo</option>
                {loadingTipos ? (
                  <option disabled>Cargando tipos...</option>
                ) : (
                  tipos.map((tipo) => (
                    <option key={tipo.id_tipo} value={tipo.id_tipo}>
                      {tipo.nombre_tipo}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label>
              Material
              <select
                name="id_material"
                value={formData.id_material}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona material</option>
                {loadingMateriales ? (
                  <option disabled>Cargando materiales...</option>
                ) : (
                  materiales.map((material) => (
                    <option key={material.id_material} value={material.id_material}>
                      {material.nombre_material}
                    </option>
                  ))
                )}
              </select>
            </label>

            {/* Campos extra */}
            {extraFields}
          </div>

          <div className="modal-actions">
            <button className="save-btn" type="submit">
              {editData && editData.id_producto ? "Guardar cambios" : "Crear"}
            </button>
            <button className="cancel-btn" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProduct;
