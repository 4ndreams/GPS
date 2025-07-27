import { useEffect, useState } from "react";
import { getAllProductos } from "@services/añadirPuertaService";

type TipoItem = "producto" | "material" | "relleno";

interface Producto {
  id_producto: number;
  nombre_producto: string;
  // otras propiedades específicas si se conocen
}

interface Material {
  id_material: number;
  nombre_material: string;
}

interface Relleno {
  id_relleno: number;
  nombre_relleno: string;
}

interface ItemUnificado {
  id_bodega: number;
  stock: number;
  tipo: TipoItem;
  detalle: Producto | Material | Relleno;
}

export default function useInfoBodegaUnificada() {
  const [data, setData] = useState<ItemUnificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllProductos();
        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          // Transformar Producto[] a ItemUnificado[]
          const productos: Producto[] = res.data;
          const itemsUnificados: ItemUnificado[] = productos.map((producto) => ({
            id_bodega: producto.id_producto, // Ajusta según la estructura real
            stock: 0, // Asigna el stock real si está disponible
            tipo: "producto",
            detalle: producto,
          }));
          setData(itemsUnificados);
        } else {
          setError("Error desconocido al obtener productos.");
        }
      } catch (err) {
        setError("Ocurrió un error inesperado." + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

