import React from "react";
import "../styles/modal.css";

interface Tipo {
  id_tipo: number;
  nombre_tipo: string;
}

interface Material {
  id_material: number;
  nombre_material: string;
}

interface ProductFormData {
  nombre_producto: string;
  precio: number;
  stock: number;
  descripcion?: string;
  medida_ancho: string;
  medida_largo: string;
  medida_alto: string;
  id_material: number;
  id_tipo: number;
}

interface ModalProductProps {
  isOpen: boolean;
  editData: ProductFormData;
  tipos: Tipo[];
  materiales: Material[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClose: () => void;
  onSave: (productData: ProductFormData) => void;
}

const ModalProduct: React.FC<ModalProductProps> = ({
  isOpen,
  editData,
  tipos,
  materiales,
  onChange,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>{editData.nombre_producto ? "Editar Producto" : "Crear Producto"}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </header>

        <div className="modal-body">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre_producto"
              value={editData.nombre_producto}
              onChange={onChange}
              placeholder="Nombre del producto"
            />
          </label>

          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={editData.precio}
              onChange={onChange}
              placeholder="Precio"
            />
          </label>

          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={editData.stock}
              onChange={onChange}
              placeholder="Stock disponible"
            />
          </label>

          <label>
            Descripción:
            <input
              type="text"
              name="descripcion"
              value={editData.descripcion || ""}
              onChange={onChange}
              placeholder="Descripción"
            />
          </label>

          <label>
            Medida Ancho:
            <input
              type="text"
              name="medida_ancho"
              value={editData.medida_ancho}
              onChange={onChange}
              placeholder="Ancho (cm)"
            />
          </label>

          <label>
            Medida Largo:
            <input
              type="text"
              name="medida_largo"
              value={editData.medida_largo}
              onChange={onChange}
              placeholder="Largo (cm)"
            />
          </label>

          <label>
            Medida Alto:
            <input
              type="text"
              name="medida_alto"
              value={editData.medida_alto}
              onChange={onChange}
              placeholder="Alto (cm)"
            />
          </label>

          <label>
            Tipo:
            <select
              name="id_tipo"
              value={editData.id_tipo || ""}
              onChange={onChange}
            >
              <option value="" disabled>Seleccione un tipo</option>
              {Array.isArray(tipos) &&
                tipos.map((tipo) => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>
                    {tipo.nombre_tipo}
                  </option>
              ))}
            </select>
          </label>

          <label>
            Material:
            <select
              name="id_material"
              value={editData.id_material || ""}
              onChange={onChange}
            >
              <option value="" disabled>Seleccione un material</option>
              {Array.isArray(materiales) &&
                materiales.map((mat) => (
                  <option key={mat.id_material} value={mat.id_material}>
                    {mat.nombre_material}
                  </option>
              ))}
            </select>
          </label>
        </div>

        <footer className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={() => onSave(editData)}>Guardar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalProduct;
