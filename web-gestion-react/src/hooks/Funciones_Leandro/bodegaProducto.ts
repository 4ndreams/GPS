import { useEffect, useState } from "react";
import { getAllProductosDesdeBodega, type ProductoBodega } from "@services/bodegaProducto.services";

export default function useGetAllProductosDesdeBodega() {
  const [productosBodega, setProductos] = useState<ProductoBodega[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mover fetchProductos fuera del useEffect para poder usarlo en refetch
  const fetchProductos = async () => {
    setLoading(true);
    const { data, error } = await getAllProductosDesdeBodega();
    if (error) {
      setError(error);
      setProductos([]);
    } else if (data) {
      setProductos(data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productosBodega, loading, error, refetch: fetchProductos };
}
