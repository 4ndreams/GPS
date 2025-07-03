import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
}

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProducto(res.data.data);

        // 👇 Aquí podrías registrar la visita
        await axios.post("/api/user-events", {
          user_id: 1, // ⚠️ reemplaza con ID real del usuario autenticado
          action: "visit",
          page: `/producto/${id}`,
        });
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

  return (
    <div className="product-detail">
      <h1>{producto.nombre_producto}</h1>
      <p><strong>Precio:</strong> ${Number(producto.precio).toLocaleString("es-CL")}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>
      <p><strong>Descripción:</strong> {producto.descripcion}</p>
      <p><strong>Dimensiones:</strong> {producto.medida_ancho} x {producto.medida_largo} x {producto.medida_alto} cm</p>
      <p><strong>Tipo:</strong> {producto.tipo?.nombre_tipo}</p>
      <p><strong>Material:</strong> {producto.material?.nombre_material}</p>
    </div>
  );
};

export default ProductDetail;
