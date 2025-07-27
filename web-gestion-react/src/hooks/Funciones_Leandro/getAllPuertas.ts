import { useEffect, useState } from "react";
import { getAllProductos } from "@services/añadirPuertaService";

interface Producto {
  id_producto: number;
  nombre_producto: string;
}

export default function useGetAllProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchProductos = async () => {
      setLoading(true);
      const { data, error } = await getAllProductos();
      console.log("Datos de productos:", data);
      if (error) {
        setError(error);
        setProductos([]);
      } else if (data) {
        setProductos(data);
        setError(null);
      }
      setLoading(false);
    };
    fetchProductos();
  }, []);

  return { productos, loading, error };
}
